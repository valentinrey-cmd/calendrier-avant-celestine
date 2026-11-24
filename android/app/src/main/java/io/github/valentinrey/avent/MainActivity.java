package io.github.valentinrey.avent;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.*;
import android.content.ContentValues;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Base64;
import java.io.*;

public class MainActivity extends Activity {
  static final String URL = "https://valentinrey-cmd.github.io/calendrier-avant-celestine/2026/?app=android";
  static final String LOCAL = "file:///android_asset/index.html";
  WebView w; ValueCallback<Uri[]> fileCb; boolean fellBack = false;
  static MainActivity inst;
  /** Commande venue de la notification, de l'écran verrouillé ou du casque → lecteur de la page. */
  static void cmd(String c) {
    MainActivity a = inst; if (a == null || a.w == null) return;
    a.w.post(() -> a.w.evaluateJavascript("try{window.__mediaCmd&&__mediaCmd('" + c + "')}catch(e){}", null));
  }

  @Override protected void onCreate(Bundle b) {
    super.onCreate(b);
    inst = this;
    Window win = getWindow();
    win.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
    win.setStatusBarColor(Color.parseColor("#0c1035"));
    win.setNavigationBarColor(Color.parseColor("#0c1035"));
    w = new WebView(this);
    w.setBackgroundColor(Color.parseColor("#0c1035"));
    setContentView(w);
    WebSettings s = w.getSettings();
    s.setJavaScriptEnabled(true);
    s.setDomStorageEnabled(true);
    s.setDatabaseEnabled(true);
    s.setMediaPlaybackRequiresUserGesture(false);
    s.setAllowFileAccess(true);
    s.setCacheMode(WebSettings.LOAD_NO_CACHE);
    w.clearCache(true);
    s.setTextZoom(100);
    s.setUseWideViewPort(true);
    s.setLoadWithOverviewMode(true);
    s.setUserAgentString(s.getUserAgentString() + " AventApp/1");
    w.setOverScrollMode(View.OVER_SCROLL_NEVER);
    w.setWebViewClient(new WebViewClient() {
      @Override public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest r) {
        Uri u = r.getUrl(); String h = u.getHost();
        if (h != null && (h.endsWith("github.io") || h.endsWith("googleapis.com") || h.endsWith("gstatic.com"))) return false;
        if ("file".equals(u.getScheme())) return false;
        try { startActivity(new Intent(Intent.ACTION_VIEW, u)); } catch (Exception e) {}
        return true;
      }
      @Override public void onReceivedError(WebView v, WebResourceRequest r, WebResourceError e) {
        if (r.isForMainFrame() && !fellBack) { fellBack = true; v.loadUrl(LOCAL); }
      }
    });
    w.setWebChromeClient(new WebChromeClient() {
      @Override public boolean onShowFileChooser(WebView v, ValueCallback<Uri[]> cb, FileChooserParams p) {
        if (fileCb != null) fileCb.onReceiveValue(null);
        fileCb = cb;
        try { startActivityForResult(p.createIntent(), 42); } catch (Exception e) { fileCb = null; return false; }
        return true;
      }
    });
    w.addJavascriptInterface(new Bridge(), "AventAndroid");
    if (b != null) w.restoreState(b); else w.loadUrl(URL + "&t=" + System.currentTimeMillis());
  }
  @Override protected void onActivityResult(int req, int res, Intent data) {
    if (req == 42 && fileCb != null) { fileCb.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(res, data)); fileCb = null; }
  }
  @Override protected void onSaveInstanceState(Bundle o) { super.onSaveInstanceState(o); w.saveState(o); }
  @Override public void onBackPressed() {
    w.evaluateJavascript("(function(){try{var p=document.querySelector('#pop .modal');if(p){closePop();return 1}if(document.body.classList.contains('playing')){go(view);return 1}if(typeof view!='undefined'&&view!='cal'){go('cal');return 1}}catch(e){}return 0})()", r -> { if ("0".equals(r)) moveTaskToBack(true); });
  }
  @Override protected void onPause() { super.onPause(); if (!MusicService.playing) w.onPause(); CookieManager.getInstance().flush(); }
  @Override protected void onDestroy() { if (inst == this) inst = null; MusicService.close(); super.onDestroy(); }
  @Override protected void onResume() { super.onResume(); w.onResume(); }
  @Override public void onWindowFocusChanged(boolean f) {
    super.onWindowFocusChanged(f);
    if (f) getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_STABLE | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
  }

  boolean askedNotif = false;
  // Pont pour enregistrer et partager le « fichier mystère » (les WebView ne savent pas télécharger un fichier généré)
  class Bridge {
    File tmp; OutputStream os; Uri saved;
    @JavascriptInterface public boolean fileBegin(String name) {
      try { if (os != null) os.close(); tmp = new File(getCacheDir(), name); os = new BufferedOutputStream(new FileOutputStream(tmp), 1 << 20); return true; } catch (Exception e) { return false; }
    }
    @JavascriptInterface public boolean fileChunk(String b64) {
      try { os.write(Base64.decode(b64, Base64.DEFAULT)); return true; } catch (Exception e) { return false; }
    }
    @JavascriptInterface public String fileEnd() {
      try {
        os.close(); os = null;
        if (Build.VERSION.SDK_INT >= 29) {
          ContentValues v = new ContentValues();
          v.put(MediaStore.MediaColumns.DISPLAY_NAME, tmp.getName());
          v.put(MediaStore.MediaColumns.MIME_TYPE, "application/octet-stream");
          v.put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS);
          saved = getContentResolver().insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, v);
          try (InputStream in = new FileInputStream(tmp); OutputStream out = getContentResolver().openOutputStream(saved)) {
            byte[] buf = new byte[1 << 16]; int n; while ((n = in.read(buf)) > 0) out.write(buf, 0, n);
          }
          tmp.delete();
          return "ok";
        } else {
          File d = getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS); File f = new File(d, tmp.getName());
          try (InputStream in = new FileInputStream(tmp); OutputStream out = new FileOutputStream(f)) {
            byte[] buf = new byte[1 << 16]; int n; while ((n = in.read(buf)) > 0) out.write(buf, 0, n);
          }
          tmp.delete(); saved = null;
          return "path:" + f.getAbsolutePath();
        }
      } catch (Exception e) { return "err:" + e.getMessage(); }
    }
    @JavascriptInterface public void mediaUpdate(String t, String a, boolean playing, double pos, double dur, String cover) {
      MusicService.update(MainActivity.this, t, a, playing, (long) pos, (long) dur, cover);
      if (playing && !askedNotif && Build.VERSION.SDK_INT >= 33) {
        askedNotif = true;
        runOnUiThread(() -> { try { if (checkSelfPermission("android.permission.POST_NOTIFICATIONS") != android.content.pm.PackageManager.PERMISSION_GRANTED) requestPermissions(new String[]{"android.permission.POST_NOTIFICATIONS"}, 7); } catch (Exception e) {} });
      }
    }
    @JavascriptInterface public void mediaStop() { MusicService.close(); }
    @JavascriptInterface public void fileShare() {
      runOnUiThread(() -> {
        try {
          if (saved == null) return;
          Intent i = new Intent(Intent.ACTION_SEND);
          i.setType("application/octet-stream");
          i.putExtra(Intent.EXTRA_STREAM, saved);
          i.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
          startActivity(Intent.createChooser(i, "Envoyer le fichier mystère"));
        } catch (Exception e) {}
      });
    }
  }
}
