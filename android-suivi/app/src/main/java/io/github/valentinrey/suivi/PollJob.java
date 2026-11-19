package io.github.valentinrey.suivi;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.job.JobInfo;
import android.app.job.JobParameters;
import android.app.job.JobScheduler;
import android.app.job.JobService;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import org.json.JSONObject;

/** Vérifie l'activité de Célestine en arrière-plan et envoie une notification. */
public class PollJob extends JobService {
  static final String BASE = "https://calendrier-celestine-default-rtdb.europe-west1.firebasedatabase.app/avent-c7v4k9q2/";
  static final String CH = "jeu";

  public static void schedule(Context c) {
    JobScheduler js = (JobScheduler) c.getSystemService(Context.JOB_SCHEDULER_SERVICE);
    if (js == null) return;
    JobInfo ji = new JobInfo.Builder(42, new ComponentName(c, PollJob.class))
        .setRequiredNetworkType(JobInfo.NETWORK_TYPE_ANY)
        .setPeriodic(15 * 60 * 1000L)
        .setPersisted(true)
        .build();
    js.schedule(ji);
  }

  public static void channel(Context c) {
    if (Build.VERSION.SDK_INT >= 26) {
      NotificationChannel ch = new NotificationChannel(CH, "Activité de Célestine", NotificationManager.IMPORTANCE_DEFAULT);
      ch.setDescription("Cases ouvertes, jeux, boss, accusation");
      NotificationManager nm = c.getSystemService(NotificationManager.class);
      if (nm != null) nm.createNotificationChannel(ch);
    }
  }

  @Override public boolean onStartJob(JobParameters p) {
    new Thread(() -> {
      try { check(this, false); } catch (Exception e) { }
      jobFinished(p, false);
    }).start();
    return true;
  }

  @Override public boolean onStopJob(JobParameters p) { return true; }

  static boolean important(String ic, String tx) {
    if (ic.equals("📅") || ic.equals("✅") || ic.equals("⚖️") || ic.equals("💘")) return true;
    if (ic.equals("🏆") && tx.startsWith("Boss")) return true;
    if (ic.equals("😈") && tx.startsWith("Lance")) return true;
    if (ic.equals("🎮") && tx.contains("(essai 1)")) return true;
    return false;
  }

  /** silent = met juste à jour le dernier événement vu (quand l'appli est ouverte). */
  static synchronized void check(Context c, boolean silent) throws Exception {
    SharedPreferences sp = c.getSharedPreferences("suivi", 0);
    List<String> rooms = new ArrayList<>();
    rooms.add("c");
    if (sp.getBoolean("test", false)) rooms.add("t");
    for (String room : rooms) {
      String last = sp.getString("last_" + room, null);
      String u = BASE + room + "/log.json?orderBy=" + URLEncoder.encode("\"$key\"", "UTF-8")
          + (last != null ? "&startAt=" + URLEncoder.encode("\"" + last + "\"", "UTF-8") + "&limitToFirst=300" : "&limitToLast=1");
      HttpURLConnection h = (HttpURLConnection) new URL(u).openConnection();
      h.setConnectTimeout(15000);
      h.setReadTimeout(20000);
      if (h.getResponseCode() != 200) { h.disconnect(); continue; }
      BufferedReader r = new BufferedReader(new InputStreamReader(h.getInputStream(), "UTF-8"));
      StringBuilder b = new StringBuilder();
      String l;
      while ((l = r.readLine()) != null) b.append(l);
      r.close();
      h.disconnect();
      String body = b.toString().trim();
      if (body.isEmpty() || body.equals("null")) continue;
      JSONObject o = new JSONObject(body);
      List<String> keys = new ArrayList<>();
      Iterator<String> it = o.keys();
      while (it.hasNext()) keys.add(it.next());
      if (keys.isEmpty()) continue;
      Collections.sort(keys);
      String newest = keys.get(keys.size() - 1);
      if (last == null || silent) { sp.edit().putString("last_" + room, newest).apply(); continue; }
      List<String> lines = new ArrayList<>();
      for (String k : keys) {
        if (k.compareTo(last) <= 0) continue;
        JSONObject e = o.optJSONObject(k);
        if (e == null) continue;
        String ic = e.optString("ic", ""), tx = e.optString("txt", "");
        if (important(ic, tx)) lines.add(ic + " " + tx);
      }
      sp.edit().putString("last_" + room, newest).apply();
      if (!lines.isEmpty()) notify(c, room, lines);
    }
  }

  static void notify(Context c, String room, List<String> lines) {
    channel(c);
    NotificationManager nm = (NotificationManager) c.getSystemService(Context.NOTIFICATION_SERVICE);
    if (nm == null) return;
    Intent i = new Intent(c, MainActivity.class);
    i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
    PendingIntent pi = PendingIntent.getActivity(c, 0, i, PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
    String title = (room.equals("t") ? "[test] " : "") + "Célestine joue !" + (lines.size() > 1 ? " (" + lines.size() + ")" : "");
    Notification.Builder nb = Build.VERSION.SDK_INT >= 26 ? new Notification.Builder(c, CH) : new Notification.Builder(c);
    Notification.InboxStyle st = new Notification.InboxStyle();
    for (int k = Math.max(0, lines.size() - 6); k < lines.size(); k++) st.addLine(lines.get(k));
    nb.setSmallIcon(android.R.drawable.star_on)
        .setContentTitle(title)
        .setContentText(lines.get(lines.size() - 1))
        .setStyle(st)
        .setAutoCancel(true)
        .setContentIntent(pi);
    nm.notify(room.equals("t") ? 2 : 1, nb.build());
  }
}
