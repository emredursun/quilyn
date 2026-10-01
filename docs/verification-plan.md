# Quilyn doğrulama ve yayın kapısı

Son ölçümler ve açık yayın kapıları: [1 Ekim yayın kontrolleri](release/2026-10-01.md). PSSA'nın kalan 19 modülü ve üç tam uzunlukta pratik mock eklendi; fiziksel cihaz ve gerçek ekran okuyucu oturumları hâlâ bekliyor.

Tarih: 1 Ekim 2026. Bu belge otomatik kontrolleri, tarayıcı senaryolarını ve henüz doğrulanmamış alanları ayırır.

## Yerel komutlar

Node 24 (`.nvmrc`) önerilir; scriptler Node 22+ destekler. Çalışma zamanı bağımlılığı veya paket kurulumu gerekmiyor.

```sh
npm run check
npm run validate:content
npm test
npm run manifest:content
git diff --check
python3 -m http.server 8000
```

`check`: çekirdek JavaScript, üretilmiş interaktif varlıklar, SW ve scriptlerin sözdizimini; içerik bütünlüğünü; manifest güncelliğini; regresyon testlerini ve kabuk boyutu bütçesini denetler. GitHub Quality workflow'u aynı komutu çalıştırır; yerel başarı uzaktaki CI koşusu değildir.

İçerik kontrolü registry referansları, ID'ler, studyGuide iç alanları, objective/topics/pitfalls/recap tabloları, soru seçenekleri/cevapları ve kaynak URL'lerini kapsar. Linklerin erişilebilirliği ve eğitim bilgilerinin doğruluğu otomatik olarak kanıtlanmaz. Tarihsel bir HTTP eğitim kaynağı envanterde korunur; runtime tıklanabilir unsafe URL üretmez.

## Uygulama sonrası sonuç

| Kontrol | Sonuç / sınır |
| --- | --- |
| JS sözdizimi | 72 kaynak/üretilmiş varlık geçti. Executable inline HTML scriptleri dış dosyalara taşındı. |
| İçerik | 11 yol, 191 modül, 1.707 pratik ve 802 mock sorusu; yaklaşık 5,35 MB JSON. |
| Test runner | 21 test geçti. Şema, geri yükleme, kurtarma, içerik referansları, offline hata/iptal, sınav yaşam döngüsü, CSP, kontrast ve kabuk bütçesi dahil. |
| Manifestler | 41 interaktif egzersiz; içerik paketleri ve provenance envanteri güncel. |
| Kabuk bütçesi | 295,8 KB sıkıştırılmamış kaynak; 300 KB sınırı geçti. CWV ölçümü değildir. |
| Tarayıcı | IAB üzerinde quiz tamamlama/restore, yedek import, SRS olayları, mock pause/resume, gerçek sunucu kesintisinde offline paket ve kontrollü SW update geçti. |
| Responsive / klavye | 320/390/768/1024/1440 ana sayfa, 320 sınav ekranı, mobil menü ve dialog odak döngüsü kontrol edildi. |
| GitHub CI / diğer cihazlar | İlk uzak CI koşusu, Safari/Firefox, gerçek mobil cihaz ve ekran okuyucu doğrulaması bekliyor. |

Ayrıntılı senaryolar ve açık işler [uygulama sonuçlarında](implementation-results.md). Aşağıdaki matris hedef yayın kapsamıdır; yukarıda belirtilmeyen cihaz/senaryolar tamamlanmış kabul edilmez.

## Tarayıcı matrisi

Fixtures kişisel veri içermeyen ayrı tarayıcı profilinde oluşturulur. Gerçek kullanıcı ilerlemesi test amacıyla silinmez.

| ID | Senaryo / fixture | Beklenen sonuç | İş |
| --- | --- | --- | --- |
| V01 | Boş profil, doğrudan ana sayfa ve modül deep link | Doğru track, başlık, erişilebilir başlangıç odağı; boş içerik yok | IMP-03/07 |
| V02 | Modül → mock → review → geri/ileri; yavaş fetch sırasında hızla gezinme | Eski yanıt çizmez; timer/abonelik sızıntısı ve çift kayıt yok | IMP-03 |
| V03 | %69 / %70 quiz, tekrarlı deneme, sayfayı yenileme | Ustalık eşiği ve kayıt kalıcı; skor geçmişi/tamamlanma kaybolmaz | IMP-02 |
| V04 | PSA/PSSA geçme sınırı, arka plan sekmesi, pause/resume, süre sonu | Track ayarı doğru; elapsed süre gerçek zamanı izler; bitmiş sınav tekrar autosave olmaz | IMP-03 |
| V05 | Geçerli v2 yedek, yanlış nested tip, aralık dışı skor, bilinmeyen ID, kota | Önizleme doğru; bozuk dosyada yazım yok; hata anlaşılır; geçerli veri round-trip yapar | IMP-02 |
| V06 | Bozuk localStorage başlangıcı ve yazımın reddedilmesi | Açılış çalışır; başarısız kayıt “kaydedildi” sayılmaz; kurtarma yolu sunulur | IMP-02 |
| V07 | 23:59 → 00:01, saat dilimi değişimi, gelecekteki dueDate | Çalışma günü olay anındaki yerel tarih; dueDate etkinlik sayılmaz | IMP-05 |
| V08 | Worker aktif olduktan sonra offline açılış; indirilmiş/indirilmemiş yol | Kabuk açılır; indirilen içerik tamamıyla çalışır; offline miss açıklanır | IMP-08 |
| V09 | Yarım indirme, cache kota sınırı, eski worker'dan güncelleme | Yarım paket hazır sayılmaz; sınav ilerlemesi korunur; güncelleme kontrollü | IMP-08 |
| V10 | PSSA eksik modüller ve sınav bankası yok | Doğru hazır modül paydası; mock yok durumu; sahte kapsam/sonuç yok | IMP-07 |
| V11 | Yalnızca klavye: nav, track, search, dialog, tab, quiz, sonuç | Görünür odak; tuzak yok; modal içinde odak tutulur; kapanınca dönüş; doğru native seçim | IMP-04 |
| V12 | Safari VoiceOver ve Firefox/Chrome erişilebilirlik ağacı | Kontrol adları, başlık yapısı, gruplama ve sonuç duyurusu doğru | IMP-04 |
| V13 | 320/390/768/1024/1440; açık/koyu; 200% zoom, 400% reflow | Metin/eylem kaybı yok; sınav/quiz seçenekleri okunabilir; focus örtülmez | IMP-06 |
| V14 | Reduced motion, uzun başlık/seçenek, hata/empty/loading | Alternatif durumlar tasarım sözleşmesini sağlar; renk tek gösterge değildir | IMP-06 |
| V15 | Kaynak URL'sinde unsafe scheme ve eksik metadata | Tehlikeli link tıklanabilir olmaz; kaynak eksikliği açık görünür | IMP-09 |

Minimum tarayıcılar: güncel macOS Safari ve Chrome; Firefox temel akış; gerçek iOS Safari ve Android Chrome'da dar ekran/offline senaryosu. Cihaz erişimi yoksa o satır “doğrulanmadı” kalır. Otomatik kontrast/erişilebilirlik taraması manuel klavye ve ekran okuyucu kontrolünü tamamlar.

## Performans ve yayın

Başlangıç ölçümünde cihaz/tarayıcı, cache durumu, ağ profili, transferred bytes ve LCP/CLS kaydedilir. İlk performans hedefleri kontrollü profilde LCP ≤2,5 s ve CLS ≤0,1; etkileşim için INP ≤200 ms saha hedefidir. Yerel tek ölçüm gerçek kullanıcı yüzdelikleri yerine kullanılmaz. Gerileme varsa değişiklik yayın öncesi açıklanır veya düzeltilir. Eşikler ve laboratuvar/saha ayrımı için [Google Web Vitals](https://web.dev/articles/vitals) esas alınır.

Yayın kapısı: otomatik kontroller yeşil; değişen akışların matris sonuçları kayıtlı; P0/P1 veri kaybı/boş ekran sorunu açık değil; yedek ve önceki uygulama sürümü geri alma için mevcut. SW/cache değişikliğinde offline + güncelleme testleri zorunlu. Daha sonra bir deployment akışı seçildiğinde bu checklist ona bağlanır; Quality workflow'u kendi başına siteyi yayınlamaz.
