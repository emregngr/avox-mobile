import { router, useLocalSearchParams } from 'expo-router'
import React, { useCallback, useMemo } from 'react'
import { ScrollView, View } from 'react-native'

import { Header, SafeLayout, ThemedButton, ThemedText } from '@/components/common'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import useThemeStore from '@/store/theme'

export default function TermsOfUse() {
  const { selectedTheme } = useThemeStore()
  const { selectedLocale } = useLocaleStore()

  const params = useLocalSearchParams()

  const trText = `Kullanım Koşulları
          \n1. Hizmet Kullanım Koşulları
          \nUygulamamızı kullanarak aşağıdaki şartları kabul etmiş sayılırsınız. Bu uygulamayı yalnızca yasal amaçlar doğrultusunda ve bu koşullara uygun olarak kullanmayı kabul ediyorsunuz.
          \n2. Kullanıcı Hesabı ve Güvenlik
          \nUygulamamızda hesap oluşturduğunuzda, hesap bilgilerinizin gizliliğini korumak sizin sorumluluğunuzdadır. Hesabınızla gerçekleştirilen tüm etkinliklerden siz sorumlusunuz.
          \n3. Gizlilik ve Veri Kullanımı
          \nKişisel verilerinizi Gizlilik Politikamıza uygun olarak topluyoruz ve işliyoruz. Uygulamayı kullanarak, verilerinizin toplanmasına ve kullanılmasına onay vermiş olursunuz.
          \n4. Kullanıcı İçeriği
          \nUygulamamıza yüklediğiniz tüm içerikten siz sorumlusunuz. Paylaştığınız içeriğin telif haklarını ihlal etmemesi ve yasalara uygun olması gerekmektedir.
          \n5. Yasaklı Kullanımlar
          \nAşağıdaki eylemler kesinlikle yasaktır:\n- Yasadışı, zararlı veya uygunsuz içerik paylaşmak\n- Başka kullanıcılara zarar vermek veya onları taciz etmek\n- Uygulamanın güvenlik önlemlerini atlatmaya çalışmak\n- Uygulamayı ticari amaçlarla izinsiz kullanmak
          \n6. Fikri Mülkiyet Hakları
          \nUygulamamızdaki tüm içerik, tasarım ve yazılım şirketimizin fikri mülkiyetidir. Bu içeriği izinsiz kopyalamak, değiştirmek veya dağıtmak yasaktır.
          \n7. Hizmet Değişiklikleri
          \nUygulamamızı ve hizmetlerimizi herhangi bir zamanda değiştirme, askıya alma veya sonlandırma hakkını saklı tutarız. Bu değişiklikler hakkında sizi bilgilendireceğiz.
          \n8. Sorumluluk Sınırlaması
          \nUygulamamızı 'olduğu gibi' sunuyoruz. Hizmetlerimizin kesintisiz veya hatasız olacağını garanti etmiyoruz. Uygulamayı kullanmanızdan doğabilecek zararlardan sorumlu değiliz.
          \n9. Hesap Sonlandırma
          \nKullanım koşullarını ihlal eden hesapları askıya alma veya sonlandırma hakkımız saklıdır. Hesabınızı istediğiniz zaman sonlandırabilirsiniz.
          \n10. İletişim ve Destek
          \nSorularınız veya sorunlarınız için destek ekibimizle iletişime geçebilirsiniz. Size en kısa sürede yardımcı olmaya çalışacağız.
          \n11. Güncellemeler ve Değişiklikler
          \nBu kullanım koşullarını zaman zaman güncelleyebiliriz. Önemli değişiklikler hakkında sizi bilgilendireceğiz. Uygulamayı kullanmaya devam etmeniz, güncel koşulları kabul ettiğiniz anlamına gelir.
          \n12. Uygulanacak Hukuk
          \nBu koşullar Türkiye Cumhuriyeti yasalarına tabidir ve bu yasalara göre yorumlanır. Ortaya çıkabilecek anlaşmazlıkların çözümünde Türkiye mahkemeleri yetkilidir.`

  const enText = `Terms of Use
         \n1. Terms of Service
         \nBy using our application, you agree to the following terms. You agree to use this application only for legal purposes and in accordance with these terms.
         \n2. User Account and Security
         \nWhen you create an account on our application, you are responsible for protecting the confidentiality of your account information. You are responsible for all activities performed with your account.
         \n3. Privacy and Data Use
         \nWe collect and process your personal data in accordance with our Privacy Policy. By using the application, you consent to the collection and use of your data.
         \n4. User Content
         \nYou are responsible for all content you upload to our application. The content you share must not infringe on copyrights and must comply with the law.
         \n5. Prohibited Uses
         \nThe following actions are strictly prohibited:\n- Sharing illegal, harmful, or inappropriate content\n- Harming or harassing other users\n- Attempting to circumvent the application's security measures\n- Using the application for commercial purposes
         \n6. Intellectual Property Rights
         \nAll content, design, and software in our application are the intellectual property of our company. It is prohibited to copy, modify, or distribute this content without permission.
         \n7. Service Changes
         \nWe reserve the right to modify, suspend, or terminate our application and services at any time. We will notify you of such changes.
         \n8. Limitation of Liability
         \nWe provide our application 'as is'. We do not guarantee that our services will be uninterrupted or error-free. We are not liable for any damages arising from your use of the application.
         \n9. Account Termination
         \nWe reserve the right to suspend or terminate accounts that violate the terms of use. You may terminate your account at any time.
         \n10. Contact and Support
         \nYou can contact our support team with any questions or issues. We will will try to assist you as soon as possible.
         \n11. Updates and Changes
         \nWe may update these terms of use from time to time. We will notify you of any significant changes. Your continued use of the application means that you accept the current terms.
         \n12. Applicable Law
         \nThese terms are governed by and construed in accordance with the laws of the Republic of Turkey. Any disputes arising hereunder shall be resolved by the courts of Turkey.`

  const text = selectedLocale === 'en' ? enText : trText

  const handleAccept = () => {
    const newParams = {
      ...params,
      termsOfUseParam: 'true',
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
      <Header leftIconOnPress={handleBackPress} title={getLocale('termsOfUse')} />

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
