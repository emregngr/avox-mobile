-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }
-keepnames class com.google.android.gms.tasks.**
-keep class com.google.android.gms.internal.consent_sdk.** { *; }
-dontwarn com.google.firebase.**
-dontwarn com.google.android.gms.**

-keep @interface com.facebook.react.bridge.ReactModule
-keep class ** {
    @com.facebook.react.bridge.ReactModule <methods>;
}
-keep class * extends com.facebook.react.bridge.BaseActivityEventListener
-keep public class * extends com.facebook.react.bridge.ReactContextBaseJavaModule
-keep public class * extends com.facebook.react.uimanager.ViewManager


-keepattributes Signature,InnerClasses,EnclosingMethod,*Annotation*

-keep class androidx.appcompat.app.AppCompatDelegate { *; }
-keep class android.content.res.Configuration { *; }
-keep class androidx.appcompat.** { *; }

-keep class com.facebook.react.modules.appearance.** { *; }

-keepclassmembers class **.R$* {
    public static <fields>;
}
