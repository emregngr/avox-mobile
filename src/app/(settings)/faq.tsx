import { router } from 'expo-router'
import React, { useCallback, useMemo, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import Collapsible from 'react-native-collapsible'
import { ScrollView } from 'react-native-gesture-handler'

import Right from '@/assets/icons/right.svg'
import { Header, SafeLayout, ThemedText } from '@/components/common'
import { getLocale } from '@/locales/i18next'
import useLocaleStore from '@/store/locale'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'

export default function Faq() {
  const { selectedLocale } = useLocaleStore()

  const { selectedTheme } = useThemeStore()

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const trFaqList = [
    {
      description:
        'Avox, havalimanları ve havayolları hakkında kapsamlı bir mobil rehber uygulamasıdır. Seyahat edenlerin veya havacılık meraklılarının, havalimanı detaylarına, anlık uçuş bilgilerine, havayolu şirketlerinin profillerine ve daha birçok bilgiye kolayca ulaşmasını sağlar.',
      title: 'Avox uygulaması nedir ve ne işe yarar?',
    },
    {
      description:
        "Avox'u indirmek ve temel özelliklerini kullanmak tamamen ücretsizdir. Tüm havalimanı ve havayolu bilgilerine hiçbir ücret ödemeden erişebilirsiniz.",
      title: 'Uygulamayı kullanmak ücretli mi?',
    },
    {
      description:
        'Avox, dünya genelindeki binlerce uluslararası ve yerel havalimanını kapsamaktadır. Arama özelliğini kullanarak veya bölgeye göre filtreleyerek aradığınız havalimanına kolayca ulaşabilirsiniz.',
      title: 'Hangi havalimanları hakkında bilgi bulabilirim?',
    },
    {
      description:
        "Bir havalimanı sayfasında; terminal bilgileri, konum ve harita, iletişim bilgileri, anlık kalkış (departures) ve iniş (arrivals) tabloları, havalimanındaki mağazalar, restoranlar ve lounge'lar gibi hizmet noktaları hakkında detaylı bilgi bulabilirsiniz.",
      title: 'Bir havalimanı için hangi detayları görebilirim?',
    },
    {
      description:
        'Evet, uygulamamız havalimanlarının anlık uçuş tablolarını güvenilir kaynaklardan alarak size sunar. Uçuş numarası ile arama yaparak veya havalimanı sayfasından rötar, iptal ve kapı bilgilerini takip edebilirsiniz. Ancak her zaman en kesin bilgi için havayolu şirketinizle teyitleşmenizi öneririz.',
      title: 'Uçuş bilgilerini (kalkış/iniş) anlık olarak takip edebilir miyim?',
    },
    {
      description:
        'Havayolu sayfalarımızda şirketin merkezi, filosundaki uçak tipleri ve sayısı, uçuş yaptığı destinasyonlar, iletişim bilgileri ve ait olduğu havayolu ittifakı (airline alliance) gibi bilgilere erişebilirsiniz.',
      title: 'Havayolu şirketleri hakkında hangi bilgilere ulaşabilirim?',
    },
    {
      description:
        'Uygulamamızdaki bilgiler, resmi havalimanı ve havayolu otoriteleri, güvenilir havacılık veri sağlayıcıları ve herkese açık kaynaklardan düzenli olarak güncellenmektedir. Anlık uçuş bilgileri gibi dinamik veriler sürekli olarak yenilenir.',
      title: 'Uygulamadaki veriler ne kadar güncel? Bilgiler nereden alınıyor?',
    },
    {
      description:
        'Evet, sık kullandığınız havalimanlarını veya takip ettiğiniz havayollarını favorilerinize ekleyerek onlara hızlı bir şekilde erişim sağlayabilirsiniz.',
      title: 'Favori havalimanı veya havayolu ekleyebilir miyim?',
    },
    {
      description:
        'Ana sayfada bulunan arama çubuğuna havalimanının adını, IATA (3 harfli) veya ICAO (4 harfli) kodunu yazarak kolayca bulabilirsiniz. Aynı şekilde havayolu şirketlerini de isimleriyle aratabilirsiniz.',
      title: 'Aradığım bir havalimanını veya havayolunu nasıl bulabilirim?',
    },
    {
      description:
        'Evet, büyük ve popüler havalimanları için terminal haritaları sunuyoruz. Bu haritalar sayesinde check-in kontuarları, güvenlik kontrol noktaları, kapılar (gates) ve diğer hizmet alanlarını kolayca bulabilirsiniz.',
      title: 'Havalimanı içi haritalar mevcut mu?',
    },
    {
      description:
        "Kesinlikle. Havalimanı detay sayfasında yeme-içme alanlarını, duty-free mağazalarını, döviz bürolarını, ATM'leri ve araç kiralama ofislerini bulabilir, konumlarını ve çalışma saatlerini (mevcutsa) görebilirsiniz.",
      title: 'Havalimanındaki mağazalar, restoranlar ve hizmetler hakkında bilgi var mı?',
    },
    {
      description:
        'Evet, birçok havalimanı için şehir merkezinden veya belirli noktalardan havalimanına ulaşım sağlayan toplu taşıma (otobüs, tren, metro) seçenekleri, taksi ve özel transfer hizmetleri hakkında bilgi sunuyoruz.',
      title: 'Havalimanına ulaşım seçeneklerini (otobüs, metro, taksi) görebilir miyim?',
    },
    {
      description:
        'Evet, her havayolu profilinde "Uçuş Ağı" veya "Destinasyonlar" başlığı altında şirketin düzenli olarak sefer yaptığı tüm şehirleri ve havalimanlarını görebilirsiniz.',
      title: 'Bir havayolunun hangi destinasyonlara uçtuğunu listeleyebilir miyim?',
    },
    {
      description:
        "Hayır, Avox'un tüm bilgi içeriğine üye olmadan erişebilirsiniz. Ancak favori ekleme ve ayarlarınızı kişiselleştirme gibi özellikler için ücretsiz bir hesap oluşturmanız gerekebilir.",
      title: 'Uygulamayı kullanmak için üye olmam veya hesap oluşturmam gerekiyor mu?',
    },
    {
      description:
        'Anlık uçuş bilgileri gibi canlı veriler için aktif bir internet bağlantısı gereklidir. Ancak daha önce görüntülediğiniz havalimanı ve havayolu temel bilgileri çevrimdışı erişim için önbelleğe alınabilir.',
      title: 'Uygulama internet bağlantısı olmadan çalışıyor mu?',
    },
    {
      description:
        'Geri bildirimleriniz bizim için çok değerli. İlgili havalimanı veya havayolu sayfasında bulunan "Geri Bildirim Gönder" veya ayarlar menüsündeki "Hata Bildir" seçeneğini kullanarak bize ulaşabilirsiniz.',
      title: 'Yanlış veya eksik bir bilgi fark ettiğimde ne yapmalıyım?',
    },
    {
      description:
        'Kullanıcı deneyimini en üst düzeyde tutmak amacıyla rahatsız edici reklamlardan kaçınıyoruz. Uygulamanın sürdürülebilirliği için minimum düzeyde ve konuyla ilgili reklamlar gösterilebilir.',
      title: 'Uygulamada reklam gösteriliyor mu?',
    },
    {
      description:
        'Avox hem Apple App Store (iOS) hem de Google Play Store (Android) üzerinden indirilebilir durumdadır.',
      title: 'Avox hangi platformlarda (iOS, Android) mevcut?',
    },
    {
      description:
        'Uygulama içindeki "Ayarlar" menüsünde bulunan "Destek" veya "İletişim" bölümünden bizimle doğrudan temasa geçebilirsiniz. Tüm öneri ve sorun bildirimlerini dikkatle inceliyoruz.',
      title:
        'Uygulama ile ilgili bir sorun yaşadığımda veya öneride bulunmak istediğimde kiminle iletişime geçmeliyim?',
    },
    {
      description:
        "Sürekli olarak Avox'u geliştiriyoruz. Gelecek planlarımız arasında uçuş bileti arama entegrasyonu, kullanıcıların havalimanı ve havayolu yorumları ekleyebilmesi, sadakat programlarının takibi ve daha fazla kişiselleştirme seçeneği gibi özellikler bulunmaktadır.",
      title: "Gelecekte Avox'a hangi yeni özelliklerin eklenmesi planlanıyor?",
    },
  ]

  const enFaqList = [
    {
      description:
        'Avox is a comprehensive mobile guide for airports and airlines. It allows travelers and aviation enthusiasts to easily access detailed airport information, real-time flight status, airline profiles, and much more.',
      title: 'What is the Avox app and what does it do?',
    },
    {
      description:
        'Downloading and using the core features of Avox is completely free. You can access all airport and airline information without any charge.',
      title: 'Is the app free to use?',
    },
    {
      description:
        "Avox covers thousands of international and domestic airports worldwide. You can easily find the airport you're looking for by using the search feature or filtering by region.",
      title: 'Which airports can I find information about?',
    },
    {
      description:
        "On an airport's page, you can find details such as terminal information, location and map, contact details, live departure and arrival boards, and information about services like shops, restaurants, and lounges.",
      title: 'What details can I see for an airport?',
    },
    {
      description:
        "Yes, our app provides live flight boards from reliable sources. You can track delays, cancellations, and gate information by searching for a flight number or by viewing the airport's page. However, we always recommend confirming with your airline for the most accurate information.",
      title: 'Can I track flight information (departures/arrivals) in real-time?',
    },
    {
      description:
        "On our airline pages, you can access information such as the company's headquarters, aircraft types and fleet size, flight destinations, contact details, and its airline alliance affiliation.",
      title: 'What information can I find about airlines?',
    },
    {
      description:
        'The information in our app is regularly updated from official airport and airline authorities, trusted aviation data providers, and public sources. Dynamic data, like live flight information, is refreshed continuously.',
      title: 'How up-to-date is the data? Where does the information come from?',
    },
    {
      description:
        'Yes, you can add your frequently used airports or followed airlines to your favorites for quick and easy access.',
      title: 'Can I add a favorite airport or airline?',
    },
    {
      description:
        'You can easily find an airport by typing its name, IATA (3-letter) code, or ICAO (4-letter) code into the search bar on the main page. Similarly, you can search for airlines by their names.',
      title: 'How can I find a specific airport or airline?',
    },
    {
      description:
        'Yes, we provide terminal maps for major and popular airports. With these maps, you can easily locate check-in counters, security checkpoints, gates, and other service areas.',
      title: 'Are there indoor maps for airports?',
    },
    {
      description:
        'Absolutely. On the airport details page, you can find dining options, duty-free shops, currency exchange offices, ATMs, and car rental services, along with their locations and operating hours (if available).',
      title: 'Is there information about shops, restaurants, and services at the airport?',
    },
    {
      description:
        'Yes, for many airports, we provide information on public transport options (bus, train, metro), as well as taxi and private transfer services from the city center or other key locations.',
      title: 'Can I see transportation options to the airport (bus, metro, taxi)?',
    },
    {
      description:
        'Yes, in each airline\'s profile, under the "Route Network" or "Destinations" section, you can see all the cities and airports the company regularly flies to.',
      title: 'Can I list the destinations an airline flies to?',
    },
    {
      description:
        "No, you can access all of Avox's informational content without an account. However, creating a free account may be required for features like adding favorites and personalizing your settings.",
      title: 'Do I need to sign up or create an account to use the app?',
    },
    {
      description:
        'An active internet connection is required for live data such as real-time flight information. However, basic information for airports and airlines you have previously viewed may be cached for offline access.',
      title: 'Does the app work without an internet connection?',
    },
    {
      description:
        'Your feedback is very valuable to us. You can contact us using the "Send Feedback" or "Report an Error" option found on the relevant airport/airline page or in the settings menu.',
      title: 'What should I do if I notice incorrect or missing information?',
    },
    {
      description:
        "To maintain the best user experience, we avoid disruptive ads. Minimal and relevant ads may be displayed to support the app's sustainability.",
      title: 'Are there ads in the app?',
    },
    {
      description:
        'Avox is available for download on both the Apple App Store (iOS) and the Google Play Store (Android).',
      title: 'On which platforms (iOS, Android) is Avox available?',
    },
    {
      description:
        'You can contact us directly through the "Support" or "Contact Us" section in the app\'s "Settings" menu. We carefully review all suggestions and bug reports.',
      title: 'Who should I contact if I have a problem with the app or want to make a suggestion?',
    },
    {
      description:
        'We are constantly improving Avox. Our future plans include features like flight ticket search integration, the ability for users to add airport and airline reviews, loyalty program tracking, and more personalization options.',
      title: 'What new features are planned for Avox in the future?',
    },
  ]

  const faqList = selectedLocale === 'en' ? enFaqList : trFaqList

  const [collapsedIndex, setCollapsedIndex] = useState<number | null>(null)

  const toggleExpanded = (index: number) => {
    setCollapsedIndex(collapsedIndex === index ? null : index)
  }

  const handleBackPress = useCallback(() => {
    router?.back()
  }, [])

  return (
    <SafeLayout>
      <Header leftIconOnPress={handleBackPress} title={getLocale('faq')} />

      <ScrollView
        className="flex-1"
        contentContainerClassName="pt-5 pb-20 px-4"
        showsVerticalScrollIndicator={false}
      >
        {faqList?.map((item, index) => (
          <View className="mb-2" key={index}>
            <TouchableOpacity
              activeOpacity={0.7}
              className="p-4 rounded-xl overflow-hidden bg-background-secondary"
              hitSlop={10}
              onPress={() => toggleExpanded(index)}
            >
              <View className="flex-row justify-between items-center">
                <View className="flex-1 pr-4">
                  <ThemedText color="text-100" type="body1">
                    {item?.title}
                  </ThemedText>
                </View>
                <Right
                  style={{
                    transform: [
                      {
                        rotate: collapsedIndex !== index ? '90deg' : '-90deg',
                      },
                    ],
                  }}
                  color={colors?.text50}
                  height={24}
                  width={24}
                />
              </View>
            </TouchableOpacity>

            <Collapsible collapsed={collapsedIndex !== index}>
              <View className="mt-2 p-4 rounded-xl overflow-hidden bg-background-tertiary">
                <ThemedText color="text-90" type="body2">
                  {item?.description}
                </ThemedText>
              </View>
            </Collapsible>
          </View>
        ))}
      </ScrollView>
    </SafeLayout>
  )
}
