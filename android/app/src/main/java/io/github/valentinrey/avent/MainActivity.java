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

public class MainActivity extends Activity {
  static final String URL = "https://valentinrey-cmd.github.io/calendrier-avant-celestine/2026/?app=android";
  static final String LOCAL = "file:///android_asset/index.html";
  WebView w; ValueCallback<Uri[]> fileCb; boolean fellBack = false;

  @Override protected void onCreate(Bundle b) {
    super.onCreate(b);
    Window win = getWindow();
    win.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
    win.setStatusBarColor(Color.parseColor("#ff9cc6"));
    win.setNavigationBarColor(Color.parseColor("#ff9cc6"));
    w = new WebView(this);
    w.setBackgroundColor(Color.parseColor("#ff9cc6"));
    setContentView(w);
    WebSettings s = w.getSettings();
    s.setJavaScriptEnabled(true);
    s.setDomStorageEnabled(true);
    s.setDatabaseEnabled(true);
    s.setMediaPlaybackRequiresUserGesture(false);
    s.setAllowFileAccess(true);
    s.setCacheMode(WebSettings.LOAD_DEFAULT);
    s.setTextZoom(100);
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
    if (b != null) w.restoreState(b); else w.loadUrl(URL);
  }
  @Override protected void onActivityResult(int req, int res, Intent data) {
    if (req == 42 && fileCb != null) { fileCb.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(res, data)); fileCb = null; }
  }
  @Override protected void onSaveInstanceState(Bundle o) { super.onSaveInstanceState(o); w.saveState(o); }
  @Override public void onBackPressed() {
    w.evaluateJavascript("(function(){try{var p=document.querySelector('#pop .modal');if(p){closePop();return 1}if(document.body.classList.contains('playing')){go(view);return 1}if(typeof view!='undefined'&&view!='cal'){go('cal');return 1}}catch(e){}return 0})()", r -> { if ("0".equals(r)) moveTaskToBack(true); });
  }
  @Override protected void onPause() { super.onPause(); w.onPause(); CookieManager.getInstance().flush(); }
  @Override protected void onResume() { super.onResume(); w.onResume(); }
  @Override public void onWindowFocusChanged(boolean f) {
    super.onWindowFocusChanged(f);
    if (f) getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_STABLE | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
  }
}
