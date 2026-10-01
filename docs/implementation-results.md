# Quilyn uygulama sonuçları

Son güncelleme: PSSA artık 25 modül, 203 pratik soru ve 3 × 60 soruluk mock içeriyor. Mock ekranında track değişimi düzeltildi; 23 test geçti. Aşağıdaki ilk uygulama kaydındaki içerik/performance durumları için güncel sonuçlar: [1 Ekim yayın kontrolleri](release/2026-10-01.md).

Tarih: 1 Ekim 2026. Önceki denetim ve uygulama planındaki IMP-01–IMP-10 için ürün kodu uygulandı. Bu belge yerel doğrulamayı ve yayın öncesi açık işleri kaydeder. Kullanıcının mevcut SSA içeriği ve çalışma alanı değişiklikleri korundu. Commit, push veya deployment yapılmadı.

## Uygulanan değişiklikler

| Paket | Sonuç |
| --- | --- |
| IMP-01 | Node tabanlı tek kalite komutu, içerik doğrulama ve GitHub Quality workflow'u. Kurulum gerektiren yeni çalışma zamanı bağımlılığı yok. |
| IMP-02 | Ortak ilerleme sözleşmesi; bütün yedek doğrulaması, gerçek soru seçenekleriyle referans kontrolü, import önizlemesi, başarısız yazımda geri yükleme, bozuk kaydın kurtarma kopyası ve görünür depolama hataları. Mevcut storage anahtarları korunuyor. |
| IMP-03 | Tek hash router, paylaşılan içerik deposu, eski async yanıt koruması, timer/abonelik temizliği. Track değişiminde sınav kaydı doğru yola yazılıyor; import sonrasında eski sınav yeni yedeğin üzerine kaydedilmiyor. |
| IMP-04 | Ortak dialog odak yönetimi, Escape ve odak dönüşü; native quiz/review seçimleri; klavye sekmeleri; sonuç duyuruları; mobil menüde inert ve odak yönetimi. |
| IMP-05 | Quiz, mock ve tekrar için kimlikli olay kaydı; olay anındaki yerel gün; tekrar girişini çift saymama. SRS son tarihinden geçmiş etkinlik üretilmiyor. |
| IMP-06 | Ayrı token, öğrenme ve bileşen CSS dosyaları; açık/koyu tema, görünür odak, reduced motion, 44 px temel kontrol hedefleri. Legacy ekran yerleşimleri ortak stillerle birlikte korunuyor. |
| IMP-07 | Devam edilecek tamamlanmamış modül, bugün tekrar, gerçek çalışma sonuçları ve kapsamı öne alan ana sayfa. PSSA hazır kapsamı 6/25 olarak görünür. Ustalık ve sınav eşiği ayrı. |
| IMP-08 | Boyut/kapsam gösteren yol paketleri; SHA-256 doğrulaması; kesilen indirmede önceki paketi koruma; paket kaldırma; kullanıcı tarafından uygulanan SW güncellemesi. Aktif sınav güncellemeyle kontrolsüz yenilenmiyor. |
| IMP-09 | Kaynak, sürüm ve inceleme tarihi gösterimi; metadata eksikliği açık etiketleniyor. URL protokol filtresi, ayrıntılı içerik validator'ı ve editoryal inceleme kuyruğu. Inline interaktif scriptler üretilmiş yerel varlıklara taşındı; script CSP yalnızca self. |
| IMP-10 | CDN/font bağımlılıkları kaldırıldı; yerel kritik stiller precache içinde. Uygulama kabuğu için 300 KB sıkıştırılmamış kaynak bütçesi otomatik kapı oldu. Yayın matrisi ve geri alma koşulları belgelendi. |

## Otomatik doğrulama

`npm run check` ve `git diff --check` başarılı:

- 72 JavaScript kaynağı/üretilmiş varlık sözdizimi kontrolünden geçti.
- 21 test geçti; başarısız test yok. Veri şeması, içerik referansları, geri yükleme, kurtarma, olay kaydı, offline başarı/iptal/hash/ağ hataları, sınav yaşam döngüsü, CSP, cache sözleşmesi ve semantik metin kontrastı kapsanıyor.
- 11 yol, 191 hazır modül, 1.707 pratik ve 802 mock sorusu doğrulandı.
- 41 interaktif egzersizin varlıkları ve manifestleri güncel.
- Uygulama kabuğu 295,8 KB sıkıştırılmamış kaynak; bu ağ aktarım veya Core Web Vitals ölçümü değildir.

## Gerçek tarayıcı doğrulaması

Codex in-app browser üzerinde ayrı localhost test verileri kullanıldı:

- Ana sayfa, modül deep link, track geçişi, arama ve gömülü egzersiz çalıştı; incelenen akışlarda console hata/uyarı görülmedi.
- PSSA quiz 8/8 tamamlandı. Yeniden açmada sonuç korundu ve deneme sayısı 1 kaldı.
- SRS yanıtı kaydedildi, kart bir üst kutuya geçti; heatmap gerçek çalışma olayını gösterdi.
- Geçerli v2 yedek önizlemesi ve uygulaması sonrasında sayfa yeniden açıldı, içeri aktarılan tema doğrulandı.
- PBA sınavında cevap verme, duraklatma, Escape ile devam ve rota değişimi sonrası kayıtlı sınavı sürdürme doğrulandı.
- PSSA sınav bankası eksikliği açık gösterildi; mevcut olmayan tam sınav sunulmadı.
- PSSA'nın 6 modüllük paketi indirildi. Test HTTP sunucusu durdurulunca daha önce ziyaret edilmemiş paket modülü ve 48 kartlık tekrar ekranı çalıştı. Ardından sunucu yeniden başlatıldı.
- Bekleyen service worker güncellemesi uygulandı; eski HTTP asset cache sorunu install sırasında cache reload kullanılarak düzeltildi.
- 320, 390, 768, 1024 ve 1440 px viewport'larda ana sayfa yatay taşmadı; 320 px sınav ekranında da yatay taşma yoktu. Mobil menü açma/kapatma ve Escape doğrulandı.
- Ayarlar dialog'unda klavye odak döngüsü, Escape ile kapanma ve odak dönüşü doğrulandı. Native seçimler ve erişilebilirlik ağacı incelendi.

## Yayın öncesi açık işler

Kod uygulaması tamamlandı; aşağıdaki doğrulamalar ve içerik işleri tamamlanmış sayılmıyor:

1. Safari/Firefox, gerçek iOS ve Android cihazları, VoiceOver ve 200%/400% zoom matrisi. Bu çalışma WCAG uygunluk sertifikası değildir.
2. Sabit cihaz/ağ profilinde LCP/CLS ölçümü ve gerçek kullanıcı INP verisi; kullanıcılarla görev bazlı kullanılabilirlik araştırması.
3. 185 modülde eksik inceleme tarihi/sürüm metadata'sının içerik sahibi tarafından doğrulanması. 191 modülde kaynak var; yalnızca 6'sında inceleme tarihi ve sürüm var. Tarihler uydurulmadı. Ayrıntılar `data/content-quality.json` içinde.
4. PSSA'nın kalan 19 modülü ve tam mock bankasının içerik üretimi. Mevcut kapsam açık gösteriliyor.
5. İlk uzaktaki GitHub CI koşusu, deployment ortamında cache/güncelleme doğrulaması ve önceki yayın sürümüne geri alma provası. Yerel test başarısı yayın yapıldığı anlamına gelmez.

İlerleme tarayıcıya yerel kalır; hesap, sunucu senkronizasyonu veya yeni backend eklenmedi. Tarayıcı depolaması kullanıcı tarafından temizlenirse yedek dışındaki ilerleme kaybolabilir; export/import kurtarma yolu mevcuttur.

İlgili belgeler: [uygulama planı](implementation-plan.md), [doğrulama matrisi](verification-plan.md), [tasarım sözleşmesi](design-system-spec.md), [denetim](enterprise-audit.md).
