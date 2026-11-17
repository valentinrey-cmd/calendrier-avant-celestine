package io.github.valentinrey.suivi;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.webkit.*;

public class MainActivity extends Activity {
  static final String URL = "https://valentinrey-cmd.github.io/calendrier-avant-celestine/suivi/?app=1";
  static final String OFF = "<html><head><meta name='viewport' content='width=device-width,initial-scale=1'></head><body style='margin:0;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#1b0f1f;color:#f6eef8;font-family:sans-serif;text-align:center;padding:20px'><div style='font-size:3rem'>📡</div><h2>Pas de connexion</h2><p style='opacity:.7'>Le suivi a besoin d'internet.</p><a href='" + URL + "' style='margin-top:14px;padding:12px 24px;border-radius:99px;background:#f2c45a;color:#2a1205;font-weight:bold;text-decoration:none'>Réessayer</a></body></html>";
  WebView w;

  @Override protected void onCreate(Bundle b) {
    super.onCreate(b);
    Window win = getWindow();
    win.setStatusBarColor(Color.parseColor("#1b0f1f"));
    win.setNavigationBarColor(Color.parseColor("#1b0f1f"));
    w = new WebView(this);
    w.setBackgroundColor(Color.parseColor("#1b0f1f"));
    setContentView(w);
    WebSettings s = w.getSettings();
    s.setJavaScriptEnabled(true);
    s.setDomStorageEnabled(true);
    s.setCacheMode(WebSettings.LOAD_DEFAULT);
    s.setTextZoom(100);
    s.setUserAgentString(s.getUserAgentString() + " SuiviApp/1");
    w.setOverScrollMode(View.OVER_SCROLL_NEVER);
    w.setWebViewClient(new WebViewClient() {
      @Override public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest r) {
        Uri u = r.getUrl(); String h = u.getHost();
        if (h != null && h.endsWith("github.io")) return false;
        try { startActivity(new Intent(Intent.ACTION_VIEW, u)); } catch (Exception e) {}
        return true;
      }
      @Override public void onReceivedError(WebView v, WebResourceRequest r, WebResourceError e) {
        if (r.isForMainFrame()) v.loadDataWithBaseURL(URL, OFF, "text/html", "utf-8", null);
      }
    });
    w.setWebChromeClient(new WebChromeClient());
    if (b != null) w.restoreState(b); else w.loadUrl(URL);
  }
  @Override protected void onSaveInstanceState(Bundle o) { super.onSaveInstanceState(o); w.saveState(o); }
  @Override public void onBackPressed() { if (w.canGoBack()) w.goBack(); else moveTaskToBack(true); }
  @Override protected void onPause() { super.onPause(); w.onPause(); CookieManager.getInstance().flush(); }
  @Override protected void onResume() { super.onResume(); w.onResume(); w.evaluateJavascript("try{window.dispatchEvent(new Event('focus'))}catch(e){}", null); }
}
