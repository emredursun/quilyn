# Quilyn uygulama planı

Tarih: 1 Ekim 2026. Kaynak: [mühendislik ve ürün denetimi](enterprise-audit.md). Bu plan iş paketlerini, bağımlılıklarını ve kabul ölçütlerini tanımlar. Ürün kodundaki uygulamalar tamamlandı; doğrulama kapsamı ve açık yayın kapıları [uygulama sonuçlarında](implementation-results.md) kayıtlıdır.

## Hedef ve mevcut temel

Hedef: Kullanıcının bir öğrenme yolu seçip çalışmaya devam edebildiği, ilerlemesine güvenebildiği, klavye ile kullanabildiği ve çevrimdışı kapsamını anlayabildiği tutarlı bir öğrenme ürünü.

Doğrulanmış envanter: 11 yol, 191 hazır modül, 1.707 modül sorusu, 802 deneme sınavı sorusu. Kayıtlı modül JSON'ları yaklaşık 4,64 MB; registry ve sınav bankasıyla toplam yaklaşık 5,35 MB. Git'e dahil olmayan yerel kurs varlıkları çevrimdışı ürün paketinin parçası değildir. Bu ölçüm aktarım sıkıştırmasını ve uygulama kabuğunu içermez.

## Başlangıç kararları

- Statik PWA ve mevcut JavaScript bileşenleri korunur. Bu backlog için framework, backend, hesap veya veritabanı zorunluluğu yoktur. Yapısal değişimler küçük, doğrulanabilir dilimlerle yapılır.
- Kullanıcının yerel ilerlemesi birincil veri kabul edilir. Registry kimlikleri, soru kimlikleri ve mevcut storage anahtarları sessizce değiştirilmez.
- İngilizce ürün arayüzü korunur; bu hazırlık belgeleri Türkçedir. Ortak bileşenlerin erişilebilir adları ürün diliyle tutarlı olur.
- Modül ustalık eşiği mevcut davranışta %70'tir. Deneme sınavı geçme eşiği etkin yolun registry ayarıdır. Bu iki ölçüt ayrı etiketlenir.
- “Sınava hazırsın” iddiası üretilmez. Kullanıcıya kapsam, deneme sonucu ve tekrar ihtiyacı gösterilir; resmî sonuç garantisi verilmez.
- SRS son tarihi geçmiş çalışma tarihi kabul edilmez. Eski kayıtlardan doğrulanamayan etkinlik günleri üretilmez.
- Hazır olmayan modül ve sınavlar ilerleme paydasından çıkarılır; kapsam eksikliği görünür kalır.
- Dış servise telemetri eklenmez. Kullanılabilirlik ölçümü, katılımcının izniyle görev bazlı araştırmada yapılır.

## Uygulanabilir backlog

Eforlar göreli büyüklüktür: S küçük/tek alan, M birkaç akış, L birden çok modül. Takvim taahhüdü değildir.

| ID | İş / başlıca dosyalar | Bağımlılık | Kabul ölçütü | Efor / durum |
| --- | --- | --- | --- | --- |
| IMP-01 | Yerel kalite kapısı ve CI — `package.json`, `scripts/`, `tests/`, `.github/workflows/quality.yml` | Yok | Sözdizimi, içerik bütünlüğü ve regresyonlar tek komutla çalışır; hatalı içerik nonzero exit verir. | S / uygulandı; ilk GitHub koşusu bekliyor |
| IMP-02 | İlerleme sözleşmesi, import önizlemesi ve hata bildirimi — `store.js`, `settings.js`, `engine.js`, `quiz-engine.js`, `mock-view.js` | IMP-01 | Tüm storage biçimleri doğrulanır; bozuk/nested veri yazılmadan reddedilir; etkilenecek kayıtlar gösterilir; kullanıcı onayından sonra uygulanır; kota hatasında elde kalan veri açıkça bildirilir. Mevcut geçerli v2 yedek round-trip yapar. | L / uygulandı; yayın doğrulaması sonuç belgesinde |
| IMP-03 | Tek router ve ekran yaşam döngüsü — `engine.js`, `app-shell.js`, `enhancement.js`, sınav/tekrar görünümleri | IMP-01; IMP-02 veri sözleşmesi | Ana içerik için tek sahip; mount/unmount simetrik; hızlı gezinmede eski fetch çizmez; geri/ileri doğru ekranı açar; ayrılan ekran timer/listener bırakmaz. | L / uygulandı; yayın doğrulaması sonuç belgesinde |
| IMP-04 | Ortak erişilebilir etkileşimler — arama, ayarlar, quiz, mock, review | IMP-03; tasarım sözleşmesi | Dialog odağı, Escape politikası ve dönüşü tutarlı; quiz native radio/checkbox davranışında; sekmeler klavye ile çalışır; sonuç/hata canlı duyurulur. | M / uygulandı; yayın doğrulaması sonuç belgesinde |
| IMP-05 | Gerçek çalışma olayları — `store.js`, `settings.js`, quiz/mock/review kayıt noktaları | IMP-02, IMP-03 | Olaylarda zaman ve olay anındaki yerel gün saklanır; aynı giriş iki kez sayılmaz; gelecekteki SRS günü etkinlik sayılmaz; saat dilimi/gün sınırı testleri geçer. | M / uygulandı; yayın doğrulaması sonuç belgesinde |
| IMP-06 | Tokenlar ve bileşen stilleri — `theme.css`, `views.css`, `index.html` | Tasarım sözleşmesi; IMP-04 davranışları | Tek token kaynağı; açık/koyu tema; görünür odak; kontrast ölçümü; 320–1440 px ekranlarda içerik kaybı yok; görsel karşılaştırmalar incelenmiş. | L / uygulandı; yayın doğrulaması sonuç belgesinde |
| IMP-07 | Hedef odaklı ana sayfa — `engine.js`, `enhancement.js` | IMP-03, IMP-05, IMP-06 | Devam et / bugün tekrar / kapsam ve sonuçlar / modüller sırası; tüm durumlarda doğru etkin yol; ilk ziyaret ve eksik kapsam için anlaşılır yönlendirme; görev testiyle doğrulama. | M / uygulandı; yayın doğrulaması sonuç belgesinde |
| IMP-08 | Yol bazlı çevrimdışı paketler ve güncelleme — `sw.js`, ayarlar, registry | IMP-02, IMP-03, IMP-06 | Paket boyutu ve kapsamı gösterilir; kesilen indirme başarı sayılmaz; indirilmiş yol uçtan uca offline çalışır; indirilmemiş içerik anlaşılır hata verir; eski/yeni cache uyumluluğu test edilir. | L / uygulandı; yayın doğrulaması sonuç belgesinde |
| IMP-09 | Kaynak, sürüm ve içerik güveni — validator, registry, modül renderer | IMP-01, IMP-06 | Kaynak/sınav sürümü/inceleme tarihi için şema ve eksik metadata durumu; bütün URL alanları render öncesi protokol kontrolünden geçer; factual review ayrı iş olarak izlenir. | M / uygulandı; yayın doğrulaması sonuç belgesinde |
| IMP-10 | Performans ve yayın kapısı — CSS/font, SW, doğrulama akışı | IMP-04, IMP-06, IMP-08 | Kritik stiller offline mevcut; sabit cihaz/ağ profilinde başlangıç ölçümü kaydedilir; yayın matrisi geçer; geri alma adımı denenir. | M / uygulandı; yayın doğrulaması sonuç belgesinde |

## Teknik sözleşmeler

### Veri ve uyumluluk

Mevcut anahtarlar: `pega_universal_state`, `pega_lms_state`, `pega_theme`, `pq_state_<hash>`, `pegaMock_<track>_<exam>`. İlk uygulama bu anahtarları korur; adaptörler biçimleri tek yerde doğrular. Gelecekteki şema sürümü yalnızca migration ve eski yedek okuma testiyle eklenir.

Doğrulama; track/module ilişkileri, tamamlanan modül dizileri, skor aralığı 0–100, deneme sayıları, tarih biçimleri, SRS kutuları ve kart kimlikleri, quiz seçimleri ve mock cevap indekslerini kapsar. Bilinmeyen eski içerik kimlikleri sessizce silinmez; önizlemede korunma veya dışarıda bırakılma durumu gösterilir. İç içe nesnelerde tehlikeli özellik adları reddedilir. Tüm dosya yazım öncesi doğrulanır; tarayıcıdaki çok anahtarlı localStorage yazımının atomik olmadığı hesaba katılır.

PSA modül içeriklerindeki `m01`–`m48`, registry'deki `SA-M01`–`SA-M48` kimliklerinin mevcut eski biçimidir. İçerik doğrulayıcı bu eşleşmeyi açıkça destekler. Sınav bankasında `multi` ve `multiple` eş anlamlıdır. Yeni içerikte registry ID ve `multi` tercih edilir. Bu uyumluluk kuralları kullanıcı ilerlemesine migration uygulanması anlamına gelmez.

### Router ve ekran yaşam döngüsü

Router rota çözümleme, etkin track ve ana içerik/sidebar montajının tek sahibi olur. `app-shell` kabuk ve genel komutları; `enhancement` veriyle hesaplanan ek öğeleri yönetir. Ayrı hash handler'larının aynı ekranı çizmesi kaldırılır. Mevcut deep link'ler korunur.

Her görünüm `mount(context)` ve idempotent `unmount()` sözleşmesi kullanır. Unmount; timer, DOM listener, store aboneliği ve bekleyen isteği temizler. İçerik deposu başarılı veriyi paylaşır, reddedilen promise'i kalıcı saklamaz. Dönüşü geç gelen istek aktif rotanın üzerine çizemez. Başlık ve ana odak rota değişiminde güncellenir.

### Çevrimdışı ve güncelleme

Uygulama kabuğu ile içerik paketi farklı durumlara sahiptir. “Offline hazır” yalnızca tüm gerekli dosyalar doğrulandığında gösterilir. Aktif sınav sırasında kontrolsüz worker değişimi/reload yapılmaz. Güncelleme önerisi ilerleme kaydedildikten sonra uygulanır. Depolama tahmini desteklenmiyorsa boyut tahmini gösterilir; kota hatası başarı gibi raporlanmaz. Paket kaldırma ilerleme kayıtlarını silmez.

## Uygulanan geliştirme dilimleri

1. **Veri adaptörleri:** Gerçek yedek biçimlerinden kişisel veri içermeyen fixture'lar; saf şema doğrulama; mevcut okuyuculara adaptör entegrasyonu. Import UI bu dilimden sonra gelir.
2. **Import akışı:** Önizleme, açık onay, yazım/geri yükleme ve hata durumları; geçerli v2 yedekle gerçek tarayıcı round-trip.
3. **Router:** Önce mevcut akışların davranış testleri; sonra tek sahip ve yaşam döngüsü; ürün görünüşü bu dilimde değiştirilmez.
4. **Bileşen pilotu:** Ayarlar dialog'u ve bir quiz ekranı; davranış/kontrast doğrulanınca ortak bileşenler diğer ekranlara yayılır.
5. **Etkinlik ve ana sayfa:** Olay sözleşmesi uygulanır; ardından doğru verilere dayanan yeni ana sayfa.

Her dilim ayrı inceleme sınırı olacak büyüklükte tutulur. Mevcut çalışma alanında kullanıcı değişiklikleri ve önceki denetim düzeltmeleri vardır; bunlar ayrıştırılmadan topluca commit edilmez. Bu çalışma kapsamında commit, push veya yayın yapılmamıştır.

## Tamamlanma ve geri alma

Her dilimde `npm run check`, `git diff --check` ve [doğrulama matrisindeki](verification-plan.md) ilgili senaryolar geçmelidir. UI diliminde [tasarım sözleşmesi](design-system-spec.md) sağlanır. Sonuçta “test edildi” ifadesi kullanılan tarayıcı, viewport ve gerçek senaryoyu belirtir.

Yayın öncesi geçerli ilerleme yedeği alınır; önceki kaynak/SW sürümü kaydedilir. Geri alma uygulama varlıklarını geri döndürür; kullanıcı ilerlemesini temizlemez. Yeni veri biçimi eklenmişse eski sürümde okuma veya kontrollü geri dönüş senaryosu denenmeden yayın yapılmaz. İlk CI başarısı, tam tarayıcı doğrulaması veya WCAG uygunluğu yerine geçmez.
