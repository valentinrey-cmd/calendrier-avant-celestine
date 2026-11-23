package io.github.valentinrey.avent;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.ServiceInfo;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.media.AudioAttributes;
import android.media.AudioFocusRequest;
import android.media.AudioManager;
import android.media.MediaMetadata;
import android.media.session.MediaSession;
import android.media.session.PlaybackState;
import android.os.Build;
import android.os.IBinder;
import android.os.PowerManager;
import android.os.SystemClock;
import android.util.Base64;

/** Lecteur « système » : notification, écran verrouillé, casque, focus audio. La musique elle-même joue dans la WebView. */
public class MusicService extends Service {
  static MusicService inst;
  static boolean playing = false;
  static final String CH = "musique", A_PREV = "prev", A_TOGGLE = "toggle", A_NEXT = "next", A_CLOSE = "close";
  static String title = "", artist = "";
  static long pos = 0, dur = 0;
  static Bitmap cover;
  MediaSession ms;
  AudioManager am;
  AudioFocusRequest afr;
  PowerManager.WakeLock wl;
  boolean pausedByFocus = false, fg = false;

  final BroadcastReceiver noisy = new BroadcastReceiver() {
    @Override public void onReceive(Context c, Intent i) { if (playing) MainActivity.cmd("pause"); }
  };
  final AudioManager.OnAudioFocusChangeListener focus = ch -> {
    if (ch == AudioManager.AUDIOFOCUS_LOSS || ch == AudioManager.AUDIOFOCUS_LOSS_TRANSIENT) { if (playing) { pausedByFocus = ch == AudioManager.AUDIOFOCUS_LOSS_TRANSIENT; MainActivity.cmd("pause"); } }
    else if (ch == AudioManager.AUDIOFOCUS_GAIN && pausedByFocus) { pausedByFocus = false; MainActivity.cmd("play"); }
  };

  static void update(Context c, String t, String a, boolean p, long po, long du, String b64) {
    title = t == null ? "" : t; artist = a == null ? "" : a; playing = p; pos = po; dur = du;
    if (b64 != null && b64.length() > 0) {
      try { byte[] d = Base64.decode(b64, Base64.DEFAULT); cover = BitmapFactory.decodeByteArray(d, 0, d.length); } catch (Exception e) { }
    } else if (b64 != null) cover = null;
    if (inst == null) {
      Intent i = new Intent(c, MusicService.class);
      try { if (Build.VERSION.SDK_INT >= 26) c.startForegroundService(i); else c.startService(i); } catch (Exception e) { }
    } else inst.refresh();
  }
  static void close() { playing = false; if (inst != null) inst.shut(); }

  @Override public void onCreate() {
    super.onCreate();
    inst = this;
    am = (AudioManager) getSystemService(AUDIO_SERVICE);
    NotificationManager nm = getSystemService(NotificationManager.class);
    if (Build.VERSION.SDK_INT >= 26 && nm.getNotificationChannel(CH) == null) {
      NotificationChannel ch = new NotificationChannel(CH, "Musique", NotificationManager.IMPORTANCE_LOW);
      ch.setShowBadge(false); nm.createNotificationChannel(ch);
    }
    ms = new MediaSession(this, "OperationChocolat");
    ms.setCallback(new MediaSession.Callback() {
      @Override public void onPlay() { MainActivity.cmd("play"); }
      @Override public void onPause() { MainActivity.cmd("pause"); }
      @Override public void onSkipToNext() { MainActivity.cmd("next"); }
      @Override public void onSkipToPrevious() { MainActivity.cmd("prev"); }
      @Override public void onSeekTo(long p) { MainActivity.cmd("seek:" + p); }
      @Override public void onStop() { MainActivity.cmd("pause"); }
    });
    Intent open = new Intent(this, MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
    ms.setSessionActivity(PendingIntent.getActivity(this, 1, open, PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT));
    ms.setActive(true);
    try { registerReceiver(noisy, new IntentFilter(AudioManager.ACTION_AUDIO_BECOMING_NOISY)); } catch (Exception e) { }
    PowerManager pm = (PowerManager) getSystemService(POWER_SERVICE);
    wl = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "avent:musique");
    wl.setReferenceCounted(false);
  }

  @Override public int onStartCommand(Intent i, int f, int id) {
    String a = i == null ? null : i.getAction();
    if (A_PREV.equals(a)) MainActivity.cmd("prev");
    else if (A_NEXT.equals(a)) MainActivity.cmd("next");
    else if (A_TOGGLE.equals(a)) MainActivity.cmd(playing ? "pause" : "play");
    else if (A_CLOSE.equals(a)) { MainActivity.cmd("stop"); shut(); return START_NOT_STICKY; }
    refresh();
    return START_NOT_STICKY;
  }

  PendingIntent act(String a, int rc) {
    return PendingIntent.getService(this, rc, new Intent(this, MusicService.class).setAction(a), PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
  }

  void refresh() {
    MediaMetadata.Builder mb = new MediaMetadata.Builder()
      .putString(MediaMetadata.METADATA_KEY_TITLE, title)
      .putString(MediaMetadata.METADATA_KEY_ARTIST, artist)
      .putString(MediaMetadata.METADATA_KEY_ALBUM, "Dossier n°24")
      .putLong(MediaMetadata.METADATA_KEY_DURATION, dur);
    if (cover != null) mb.putBitmap(MediaMetadata.METADATA_KEY_ALBUM_ART, cover);
    ms.setMetadata(mb.build());
    ms.setPlaybackState(new PlaybackState.Builder()
      .setActions(PlaybackState.ACTION_PLAY | PlaybackState.ACTION_PAUSE | PlaybackState.ACTION_PLAY_PAUSE | PlaybackState.ACTION_SKIP_TO_NEXT | PlaybackState.ACTION_SKIP_TO_PREVIOUS | PlaybackState.ACTION_SEEK_TO | PlaybackState.ACTION_STOP)
      .setState(playing ? PlaybackState.STATE_PLAYING : PlaybackState.STATE_PAUSED, pos, playing ? 1f : 0f, SystemClock.elapsedRealtime())
      .build());

    Notification.Builder nb = Build.VERSION.SDK_INT >= 26 ? new Notification.Builder(this, CH) : new Notification.Builder(this);
    nb.setSmallIcon(R.mipmap.ic_launcher)
      .setContentTitle(title)
      .setContentText(artist)
      .setSubText("Dossier n°24")
      .setContentIntent(ms.getController().getSessionActivity())
      .setDeleteIntent(act(A_CLOSE, 14))
      .setVisibility(Notification.VISIBILITY_PUBLIC)
      .setOnlyAlertOnce(true)
      .setShowWhen(false)
      .setOngoing(playing)
      .addAction(new Notification.Action.Builder(android.R.drawable.ic_media_previous, "Précédent", act(A_PREV, 11)).build())
      .addAction(new Notification.Action.Builder(playing ? android.R.drawable.ic_media_pause : android.R.drawable.ic_media_play, playing ? "Pause" : "Lecture", act(A_TOGGLE, 12)).build())
      .addAction(new Notification.Action.Builder(android.R.drawable.ic_media_next, "Suivant", act(A_NEXT, 13)).build())
      .setStyle(new Notification.MediaStyle().setMediaSession(ms.getSessionToken()).setShowActionsInCompactView(0, 1, 2));
    if (cover != null) nb.setLargeIcon(cover);
    Notification n = nb.build();
    try {
      if (playing || !fg) {
        if (Build.VERSION.SDK_INT >= 29) startForeground(7, n, ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK); else startForeground(7, n);
        fg = true;
      }
      if (!playing) { stopForeground(false); fg = false; getSystemService(NotificationManager.class).notify(7, n); }
    } catch (Exception e) { getSystemService(NotificationManager.class).notify(7, n); }

    if (playing) {
      if (!wl.isHeld()) wl.acquire(6 * 60 * 60 * 1000L);
      if (Build.VERSION.SDK_INT >= 26) {
        if (afr == null) afr = new AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN)
          .setAudioAttributes(new AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_MEDIA).setContentType(AudioAttributes.CONTENT_TYPE_MUSIC).build())
          .setOnAudioFocusChangeListener(focus).build();
        am.requestAudioFocus(afr);
      } else am.requestAudioFocus(focus, AudioManager.STREAM_MUSIC, AudioManager.AUDIOFOCUS_GAIN);
    } else if (wl.isHeld()) wl.release();
  }

  void shut() {
    playing = false;
    try { if (wl.isHeld()) wl.release(); } catch (Exception e) { }
    try { if (Build.VERSION.SDK_INT >= 26 && afr != null) am.abandonAudioFocusRequest(afr); else am.abandonAudioFocus(focus); } catch (Exception e) { }
    try { stopForeground(true); } catch (Exception e) { }
    getSystemService(NotificationManager.class).cancel(7);
    stopSelf();
  }

  @Override public void onTaskRemoved(Intent r) { MainActivity.cmd("pause"); shut(); }
  @Override public void onDestroy() {
    try { unregisterReceiver(noisy); } catch (Exception e) { }
    try { ms.setActive(false); ms.release(); } catch (Exception e) { }
    if (inst == this) inst = null;
    super.onDestroy();
  }
  @Override public IBinder onBind(Intent i) { return null; }
}
