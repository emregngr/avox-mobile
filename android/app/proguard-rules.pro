-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }
-keep class com.google.android.gms.internal.consent_sdk.** { *; }

-keep class com.google.firebase.auth.** { *; }

-keep class com.google.firebase.firestore.** { *; }

-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.common.** { *; }
-keepnames class com.google.android.gms.tasks.**

-keepattributes Signature,InnerClasses,EnclosingMethod

-dontwarn com.google.firebase.**
-keepattributes Signature
-keepattributes *Annotation* 

-keep @interface com.facebook.react.bridge.ReactModule
-keep class ** {
    @com.facebook.react.bridge.ReactModule <methods>;
}
-keep class * extends com.facebook.react.bridge.BaseActivityEventListener
-keep public class * extends com.facebook.react.bridge.ReactContextBaseJavaModule
-keep public class * extends com.facebook.react.uimanager.ViewManager
