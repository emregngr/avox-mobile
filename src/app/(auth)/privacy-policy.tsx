import { router, useLocalSearchParams } from 'expo-router'
import React, { useCallback, useMemo } from 'react'
import { ScrollView, View } from 'react-native'

import { Header, SafeLayout, ThemedButton, ThemedText } from '@/components/common'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import useThemeStore from '@/store/theme'

export default function PrivacyPolicy() {
  const { selectedTheme } = useThemeStore()
  const { selectedLocale } = useLocaleStore()

  const params = useLocalSearchParams()

  const trText = `Gizlilik Politikası
          \nBu gizlilik politikası, uygulamanın kişisel verilerinizi nasıl topladığını,kullandığını ve koruduğunu açıklamaktadır.
          \n1. Toplanan Bilgiler
          \nSizden doğrudan topladığımız bilgiler:\n\n- Ad ve soyadı\n- E-posta adresi\n- Telefon numarası\n- Doğum tarihi\n- Profil fotoğrafı\n- Hesap tercihleri\n\nOtomatik olarak toplanan bilgiler:\n\n- Cihaz bilgileri (model, işletim sistemi)\n- IP adresi\n- Kullanım istatistikleri\n- Uygulama performans verileri\n- Konum bilgileri (izin verdiğinizde)
          \n2. Bilgilerin Kullanımı
          \nTopladığımız bilgileri aşağıdaki amaçlarla kullanıyoruz:\n- Hesabınızı oluşturmak ve yönetmek\n- Hizmetlerimizi sunmak ve geliştirmek\n- Size özelleştirilmiş içerik ve öneriler sunmak\n- Güvenliği sağlamak ve dolandırıcılığı önlemek\n- Yasal yükümlülüklerimizi yerine getirmek\n- Sizinle iletişim kurmak ve destek sağlamak
          \n3. Bilgi Paylaşımı
          \nKişisel bilgilerinizi aşağıdaki durumlar dışında üçüncü taraflarla paylaşmıyoruz:
          \n- Açık rızanız olduğunda\n- Yasal zorunluluk durumunda\n- Hizmet sağlayıcılarımızla (veri işleme, hosting gibi)\n- Şirket birleşmesi veya satın alma durumunda
          \n4. Veri Güvenliği
          \nKişisel verilerinizi korumak için aşağıdaki önlemleri alıyoruz:
          \n- Şifreleme teknolojileri\n- Güvenli sunucu altyapısı\n- Düzenli güvenlik değerlendirmeleri\n- Çalışan gizlilik eğitimleri\n- Veri erişim sınırlamaları
          \n5. Kullanıcı Hakları
          \nKVKK kapsamında aşağıdaki haklara sahipsiniz:\n- Verilerinize erişim hakkı\n- Düzeltme talep etme hakkı\n- Silme talep etme hakkı\n- İşlemeyi sınırlandırma hakkı\n- Veri taşınabilirliği hakkı\n- İtiraz etme hakkı
          \n6. Çerezler ve İzleme
          \nUygulamamız çerezleri ve benzer teknolojileri aşağıdaki amaçlarla kullanır:\n- Oturum yönetimi\n- Tercihlerinizi hatırlama\n- Kullanım analizi\n- Performans iyileştirme
          \n7. Çocukların Gizliliği
          \nHizmetlerimiz 13 yaşından küçük çocuklara yönelik değildir. Bilerek 13 yaşından küçük çocuklardan kişisel bilgi toplamıyoruz.
          \n8. Uluslararası Veri Transferi
          \nVerileriniz güvenli sunucularda, Türkiye'de ve/veya AB ülkelerinde saklanabilir ve işlenebilir. Tüm veri transferleri ilgili veri koruma yasalarına uygun olarak gerçekleştirilir.
          \n9. Reklam ve Pazarlama
          \nPazarlama iletişimleri için her zaman izninizi alırız. İstediğiniz zaman bu iletişimleri durdurabilirsiniz.
          \n10. Değişiklikler
          \nBu gizlilik politikasını zaman zaman güncelleyebiliriz. Önemli değişikliklerde sizi bilgilendireceğiz.
          \n11. İletişim
          \nGizlilik politikamız hakkında sorularınız için:\nE-posta: avox.aviation@gmail.com\nTelefon: +90 xxx xxx xx xx\nAdres: İstanbul, Türkiye
          \n12. Yasal Dayanak
          \nBu gizlilik politikası, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve ilgili mevzuat uyarınca hazırlanmıştır.`

  const enText = `Privacy Policy
          \nThis privacy policy explains how the application collects, uses, and protects your personal data.
          \n1. Information Collected
          \nInformation we collect directly from you:\n- First and last name\n- Email address\n- Phone number\n- Date of birth\n- Profile photo\n- Account preferences\n\nInformation collected automatically:\n- Device information (model, operating system)\n- IP address\n- Usage statistics\n- Application performance data\n- Location information (when you give permission)
          \n2. Use of Information
          \nWe use the information we collect for the following purposes:\n- To create and manage your account\n- To provide and improve our services\n- To provide you with personalized content and recommendations\n- To ensure security and prevent fraud\n- To fulfill our legal obligations\n- To communicate with you and provide support
          \n3. Information Sharing
          \nWe do not share your personal information with third parties except in the following circumstances:
          \n- When we have your explicit consent\n- When required by law\n- With our service providers (such as data processing and hosting providers)\n- In the event of a merger or acquisition of the company
          \n4. Data Security
          \nWe take the following measures to protect your personal data:
          \n- Encryption technologies\n- Secure server infrastructure\n- Regular security assessments\n- Employee privacy training\n- Data access restrictions
          \n5. User Rights
          \nUnder the KVKK, you have the following rights:\n- Right to access your data\n- Right to request correction\n- Right to request deletion\n- Right to restrict processing\n- Right to data portability\n- Right to object
          \n6. Cookies and Tracking
          \nOur application uses cookies and similar technologies for the following purposes:\n- Session management\n- Remembering your preferences\n- Usage analysis\n- Performance improvement
          \n7. Children's Privacy
          \nOur services are not intended for children under the age of 13. We do not knowingly collect personal information from children under the age of 13.
          \n8. International Data Transfer
          \nYour data may be stored and processed on secure servers in Turkey and/or EU countries. All data transfers are carried out in accordance with applicable data protection laws.
          \n9. Advertising and Marketing
          \nWe always obtain your consent for marketing communications. You may opt out of these communications at any time.
          \n10. Changes
          \nWe may update this privacy policy from time to time. We will notify you of any significant changes..
          \n11. Contact
          \nFor questions about our privacy policy:\nEmail: avox.aviation@gmail.com\nPhone: +90 xxx xxx xx xx\nAddress: Istanbul, Turkey
          \n12. Legal Basis
          \nThis privacy policy has been prepared in accordance with the Personal Data Protection Law No. 6698 (KVKK) and related legislation.`

  const text = selectedLocale === 'en' ? enText : trText

  const handleAccept = () => {
    const newParams = {
      ...params,
      privacyPolicyParam: 'true',
    }

    router.navigate({
      params: newParams,
      pathname: '/register',
    })
  }

  const handleBackPress = useCallback(() => {
    router?.back()
  }, [])

  const indicatorStyle = useMemo(
    () => (selectedTheme === 'light' ? 'black' : 'white'),
    [selectedTheme],
  )

  return (
    <SafeLayout>
      <Header backIconOnPress={handleBackPress} title={getLocale('privacyPolicy')} />

      <ScrollView
        className="flex-1"
        contentContainerClassName="py-5 px-4"
        indicatorStyle={indicatorStyle}
      >
        <ThemedText color="text-100" type="body1">
          {text}
        </ThemedText>
      </ScrollView>
      <View className="mt-5 mb-10 mx-4">
        <ThemedButton label={getLocale('accept')} onPress={handleAccept} type="border" />
      </View>
    </SafeLayout>
  )
}
