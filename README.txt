Yazan: Arda Altun
Tarih: 17/03/2025

VideoDiaryApp Dokümantasyonu

Bu dokümantasyon, VideoDiaryApp'in tüm modüllerini, iş akışını ve kullanılan teknolojileri detaylandırmaktadır. Uygulama hem frontend (React Native) hem de backend (Node.js/Express + FFMPEG) bölümlerini içermektedir.

1. Genel Bakış

VideoDiaryApp, kullanıcıların cihazlarından video seçmesini, belirli bir aralığı kırparak saklamasını ve meta veriler (başlık, açıklama, kapak fotoğrafı vb.) ekleyerek listelemesini sağlayan bir mobil uygulamadır.

Uygulama, modern React Native teknolojileriyle geliştirilmiş olup, video kırpma işlemleri Node.js tabanlı bir sunucu ile FFMPEG kullanılarak gerçekleştirilir.

2. Kullanılan Teknolojiler

Expo (React Native)
Uygulamanın temelini oluşturan çerçeve.

Expo AV (Video)
Videonun oynatılması ve kontrolü için kullanılan kütüphane.

FFMPEG
Videonun belirtilen aralığını kırpmak için kullanılan video işleme aracı.

Zustand
Uygulama genelinde durum yönetimi (state management) için.

Tanstack Query
Asenkron işlemleri ve FFMPEG entegrasyonunu yönetmek için kullanıldı.

React Native Reanimated
Animasyonlu bileşenler ve geçişler için.

Zod
Form verilerinin doğrulanması ve tip kontrolü için.

Expo SQLite
Kırpılan videoların meta verilerini (ad, açıklama, süre vb.) kalıcı olarak saklamak için.


---

3. Mimari ve İş Akışı

3.1 Genel Mimari

Frontend (React Native/Expo)
Uygulamanın arayüzü ve işlevselliği React Native bileşenleri ve özel hook’lar ile geliştirilmiştir.

Backend (Node.js/Express)
Video dosyaları sunucuya yüklenir ve FFMPEG ile kırpılır. Kırpılan videolar istemciye indirilir.

Veritabanı (SQLite)
Kırpılan videolar ve meta veriler yerel SQLite veritabanında saklanır.



---

4. Uygulama Özellikleri

4.1. Video İşleme

Cihazdan video seçme (galeri veya kamera)

Seçilen videonun belirli bir aralığını kırpma

Videoya başlık ve açıklama ekleme

Kırpılmış videoların listelenmesi ve detay görüntüleme


4.2. Meta Veri Yönetimi

Kırpılan videoya ad(başlık) ve açıklama ekleme

Veritabanına kalıcı olarak kaydetme

Video başlığını ve açıklamasını düzenleme


4.3. Video Listeleme ve Oynatma

Daha önce eklenmiş videoları listeleme

Videonun başlık, açıklama ve süresini görüntüleme

Video oynatma, düzenleme ve silme işlemleri


4.4. Kalıcı Depolama

Videoların meta verileri SQLite ile saklanır

Uygulama genelinde Zustand ile global state yönetimi sağlanır



---

5. Klasör Yapısı

VideoDiaryApp/
├─ .expo/                      
├─ metro/
│  ├─ devices.json             
├─ .idea/                      
├─ app/
│  ├─ backend/
│  │  ├─ db/
│  │  │  └─ database.ts        # SQLite veritabanı işlemleri
│  │  ├─ services/
│  │  │  └─ video.service.ts   # FFMPEG, upload, trim vb. video işleme servisleri
│  │  ├─ store/
│  │  │  └─ video.store.ts     # Zustand store (videoların global state yönetimi)
│  │  └─ types/
│  │     └─ video.types.ts     # Video ile ilgili TypeScript tip tanımları
│  ├─ hooks/
│  │  └─ useVideoProcessing.ts # Tanstack Query ile kırpma, silme, düzenleme vb. işlemler
├─ assets/                     # Uygulama varlıkları (resim, ikon vs.)
├─ components/
│  ├─ home/
│  │  ├─ components/
│  │  │  ├─ Header.tsx         # Üst kısım başlık bileşeni
│  │  ├─ index.ts              # Home ile ilgili component index'i
│  │  ├─ VideoList.tsx         # Kırpılmış videoların listesi
│  ├─ shared/
│  │  ├─ Card.ts               # Kart bileşeni
│  │  ├─ GradientBackground.tsx
│  │  └─ ProcessingModal.tsx   # "İşleniyor" göstergesi
│  └─ video/
│     ├─ VideoSelectModal.tsx
│     ├─ VideoPlayer.tsx
│     ├─ PhotoSelectModal.tsx
│     ├─ MetadataForm.tsx
│     ├─ EditVideoModal.tsx
│     ├─ components/
│     │  ├─ VideoAppBar.tsx    # Video üst çubuğu
│     │  ├─ VideoControls.tsx  # Oynatma/durdurma kontrolleri
│     │  ├─ VideoDetailCard.tsx
│     │  ├─ index.ts
├─ navigation/
│  ├─ stacks/
│  │  ├─ CutStack.tsx          # Video kırpma ile ilgili stack
│  │  ├─ HomeStack.tsx         # Ana sayfa ile ilgili stack
│  ├─ index.ts
│  ├─ TabNavigator.tsx         # Alt sekme (Tab) navigasyonu
│  ├─ types.ts
├─ screens/
│  ├─ home/
│  │  ├─ VideoCutScreen.tsx    # Video kırpma ekranı
│  │  └─ VideoListScreen.tsx   # Video listesi ekranı
│  ├─ video/
│  │  ├─ MetadataFormScreen.tsx  # Meta veri (başlık, açıklama) ekleme ekranı
│  │  └─ VideoPlayerScreen.tsx   # Video detay sayfası
│  ├─ index.ts
├─ server/
│  ├─ .expo/                   
│  ├─ node_modules/            
│  ├─ src/
│  │  ├─ index.js              # Node.js/Express tabanlı video yükleme + kırpma servisi
│  ├─ uploads/                 
│  ├─ .env                     # Sunucuya özel ayarlar
├─ theme/
│  ├─ colors.ts
│  ├─ ThemeProvider.tsx
├─ .gitignore
├─ App.tsx                     # Uygulamanın başlangıç bileşeni
├─ app.json
├─ babel.config.js
├─ package-lock.json
├─ package.json
├─ tsconfig.json
├─ README.txt
├─ config.ts

---

6. Veritabanı Yönetimi (SQLite)

6.1. Veritabanı Açma

expo-sqlite kullanılarak videodiary.db dosyası oluşturulur.

6.2. CRUD İşlemleri

saveVideo: Yeni video kaydı ekleme

getAllVideos: Tüm videoları sıralı olarak getirme

getVideoById: Belirli bir videoyu getirme

deleteVideo: Videoyu silme

updateVideo: Video başlığını ve açıklamasını güncelleme



---

7. Video İşleme Servisleri

7.1. Backend (Node.js/Express + FFMPEG)

Multer ile video yükleme

FFMPEG ile belirli sürede video kırpma

CORS ve Express JSON ile istemciden gelen verileri işleme


Örnek API Endpoint’leri:

POST /upload – Video yükleme

POST /trim – Video kırpma işlemi


7.2. Frontend – useVideoProcessing Hook

videosQuery: Tüm videoları getirme

trimVideoMutation: Video kırpma işlemi

saveVideoMutation: Kırpılmış videoyu kaydetme

deleteVideoMutation: Video silme

editVideoMutation: Video başlığını/açıklamasını güncelleme


---

8. Navigasyon (React Navigation)

Bottom Tab Navigation:

Ana ekran (VideoList) ve Video Kırpma (VideoCut) sekmeleri


Stack Navigasyon:

Video oynatma, meta veri ekleme ve kırpma işlemleri için organize edilmiş yapılar

---

9. Kullanıcı Arayüzü Bileşenleri

9.1. Ortak Bileşenler

Header: Sayfa başlıklarını gösterir

Card: Videoları listelemek için

ProcessingModal: İşlem devam ederken gösterilen modal


9.2. Video Bileşenleri

VideoList: Kırpılmış videoları listeler

VideoPlayer: Video oynatma ekranı

EditVideoModal: Video düzenleme penceresi

VideoSelectModal: Kullanıcının video seçmesini sağlayan modal



---

10. Kurulum ve Çalıştırma

10.1. Backend (Sunucu) Çalıştırma

cd server
npm install
npm run dev

Sunucu varsayılan olarak http://localhost:3000 adresinde çalışır (.env dosyasına göre değişebilir).

10.2. Mobil Uygulamayı Çalıştırma

cd VideoDiaryApp
npm install
npx expo start -c

-c parametresi önbelleği temizler, olası sürüm uyuşmazlıklarını azaltır.

Komut sonrasında Expo CLI açılacaktır.

Gerçek cihazda test: QR kod taranarak çalıştırılabilir

Emülatörde test: Terminalde a yazarak Android, i yazarak iOS başlatılabilir

>>> Önemli Not: Expo Go uygulamasının SDK 50 uyumlu sürümünü kullanmanız gerekir. 
Bu yüzden SDK 50 destekli bir Expo Go APK’si veya sürümü yüklemeniz tavsiye edilir. 
Aksi halde uygulama doğru şekilde çalışmayabilir.

>>> Önemli Not: Projeyi hangi bilgisayarda veya ağda çalıştıracaksanız, config.ts dosyasındaki API_URL değerini, o anki makinenin IP adresine (veya localhost yerine geçerli IP adresine) elle güncellemeniz gerekir.
Örneğin, eğer sunucuyu çalıştıran bilgisayarın IP adresi 192.168.1.10 ise config.ts dosyasında 

export const API_URL = 'http://192.168.1.10:3000';

şeklinde yazılmalıdır.Aksi halde istemci (mobil uygulama) sunucuya ulaşamadığı için Network request failed gibi hatalar alabilirsiniz.
IP adresini bulmak için cmd açıp ipconfig yazarak kullandığınız IP adresini "IPv4 Address" kısmında görebilirsiniz. Bu adres genellikle "192.168.x.x" formatında olur. 
---
11. Kullanım Senaryosu

11.1 Ana Ekran (VideoList)

Daha önce eklenmiş/kırpılmış videoları listeler.

Alt menüden (TabNavigator) Video Kırp sekmesiyle yeni video ekleme ekranına geçilir.



11.2 Video Kırp Ekranı (VideoCutScreen)

Cihazdan video seçimi (galeri veya kamera).

Seçilen video, scrubber ile baş ve son noktası belirlenerek kırpılır.

Kırpma esnasında Tanstack Query ile FFMPEG süreci yönetilir ve ProcessingModal gösterilir.

İstenirse kırpma iptal edilebilir.

Günlüğe kaydete basıldığında 


11.3 Meta Veri Ekleme (MetadataForm)

Kırpılan videonun ad(başlık) ve açıklaması girilir.

Kaydedildiğinde veriler SQLite veritabanına eklenir.


11.4 Video Listesi

Kırpılan videoların listesi SQLite veritabanından okunur (Tanstack Query + Zustand).

Bir videoya dokunarak Video Detay ekranına gidilir.


11.5 Video Detay (VideoPlayer)

Videonun kendisi, ad(başlık) ve açıklama görüntülenir.

Kullanıcı isteğe bağlı olarak sağ üstte bulunan ikona bastığında EditVideoModal pop-up olarak açılır. Kullanıcı burada ad/açıklamayı güncelleyebilir.

11. Sonuç

Bu dokümantasyon, VideoDiaryApp'in tüm teknik detaylarını ve işleyişini açıklamaktadır.Herhangi bir ek bilgi ihtiyacınız olursa, benimle iletişime geçebilirsiniz.