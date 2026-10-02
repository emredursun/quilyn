# Quilyn öğrenme deneyimi uygulama planı

Tarih: 2 Ekim 2026. Kullanıcı araştırması hipotezleri ve kod bulguları üzerinden önceliklendirilmiştir. Yayın ve commit, uygulama durumundan ayrı izlenir.

## Aşama 1 — Doğru öğrenme verisi

1. **SRS seçimi:** Vadesi gelen tekrarları yeni kartlarla dengele; farklı modüllerden seç; yüksek güvenle yapılmış hatalara sınırlı öncelik ver. Çözülen öncelikli hataları kuyruktan çıkar. Kabul: boş PSSA kaydında ilk iki modüle yığılma yok, tekrarlar yeni kartlar tarafından aç bırakılmıyor, aynı oturumda kart tekrarı yok.
2. **Göstergeler:** SRS ustalığı her yerde Box 5; kopmuş streak gösterimi sıfır; Focus Areas son üç quiz sonucunu kullanır. Geçmiş en iyi skor ve tamamlanma başarısı korunur. Kabul: %90 ardından %40 alan modül zayıf alan değerlendirmesine girer; Box 3 ustalaşıldı sayılmaz.
3. **Quiz kayıtları:** Soru ID'si ve içerik imzasıyla kayıt; eski indeks kayıtlarını koruyarak taşıma; soru/cevap değişiminde eski grading'in geçersiz kılınması. Kabul: soru/şık sırası değişimi cevapları başka soruya taşımaz; eski yedekler kabul edilir; yeni yedekler doğrulanır. İlk eski kayıtta içerik imzası bulunmadığından geçmişteki sıralama değişimi kesin olarak tespit edilemez; bu sınır görünür olmalıdır.

## Aşama 2 — Günlük kullanıcı değeri

- Soru düzeyinde deneme kaydı: ID, içerik sürümü, seçilen cevap, doğru/yanlış, modül/alan, mod, zaman ve tamamlanma durumu. Mock özetlerini sakla; import/export ve sınırlı saklama politikasını ekle. Aşama 1'e bağımlı.
- Yanlışlar defteri: quiz/mock/review birleştirme, filtre, emin olarak yapılan hatalar, beş soruluk tekrar ve ilgili derse dönüş. Çözülen hatalar geçmişte kalır; aktif hata sayısından çıkar.
- Öğrenme/sınav modları: mod seçimi, simülasyonda teslim öncesi cevap gizleme, işaretle/atla/geri dön, mobil tek soru ve isteğe bağlı liste. Simülasyon kuralları başlangıçta açık; aktif deneme sürdürme aynı modu korur.
- Kabul: her deneme geçmişten açılır; sonuçlar puanla tutarlı; çevrimdışı ve yedekle geri yükleme çalışır; simülasyon öğrenme denemeleriyle aynı trendde karıştırılmaz.

## Aşama 3 — Kişiselleştirme

- Sınav tarihi ve günlük süreye göre değiştirilebilir çalışma planı. Önerinin gerekçesi gösterilir; kullanıcı atlayabilir. Başlangıçta süreler açık tahminlerdir.
- Sonuçlardan ders bölümüne yönlendirme; editoryal yanlış şık açıklamaları.
- Yer imleri, son sekme/bölüm konumu, tamamlanan yol için tekrar önerisi.
- Kabul: çalışma planı son sonuçlardan güncellenir; cihazda kalır ve yedeklenir; boş/yetersiz veri “hazırsın” iddiası üretmez.

## Aşama 4 — İçerik, erişim ve büyüme

- İçerik indeksi ve kavram sözlüğü; konuya doğrudan bağlantı. Ek indeks ana kabuğun 300 KB bütçesine yüklenmez.
- Kısa bankaları “Mini Practice” olarak ayır; kaynak/sürüm/editoryal durum, bağlamlı hata bildirimi ve değişiklik geçmişi.
- GitHub Pages'e uygun statik track/ders sayfaları; benzersiz metadata, canonical, sitemap ve mevcut deep linklerle uyumluluk. Üst sıralama garantisi verilmez.
- Çoklu sekme kayıt eşitleme; isteğe bağlı cihazlar arası senkronizasyon için ayrı backend, veri çatışması ve gizlilik tasarımı.
- AI öğretmeni, bağımsız readiness puanı ve hesap sistemi bu sürümlerin kabul ölçütü değildir; ayrı ürün kararı gerektirir.

## Her teslimatın doğrulaması

Veri değişikliklerinde anlamlı regresyon ve migration testleri; `npm run check`, `git diff --check`, dar/masaüstü viewport, klavye ve offline akış kontrolü. Mevcut ilerleme silinmez. Yeni özellikler küçük paketlerle teslim edilir. Gerçek iOS/Android ve VoiceOver/TalkBack testleri ayrıca yapılmalıdır; viewport testleri bunların yerine geçmez.

Ürün ölçümü: ilk çalışmaya ulaşma süresi, tekrar oturumunu tamamlama, çözülen tekrarlayan hata ve haftalık çalışma planını tamamlama. Opt-in ölçüm ve kullanıcı görüşmeleri olmadan kullanım etkisi kanıtlanmış sayılmaz.

## Durum

Aşama 1–2 doğrulandı ve `296fb78` commit’ine alındı. Push/yayın yapılmadı. Aşama 3’ün ilk kişiselleştirme paketi yerel olarak kodlandı ve doğrulandı; bu paket `a6e418e` commit’ine alındı. Sonuçlardan belirli ders bölümüne editoryal eşleştirme ve yanlış şık açıklamaları kalan Aşama 3 işleridir. Aşama 4 henüz uygulanmadı.

### Aşama 1 teslim kaydı

- Oturum kapasitesi 15 kart. Yeni kartlar da varsa hedef en fazla 11 zamanlı tekrar + kalan yeni kartlar; havuz küçükse boş kapasite diğer havuzdan doldurulur. Öncelikli Box 1 hataları en fazla beş başlangıç slotu alır. Seçim modüller arasında döner; soru yinelenmez. Çözülen yüksek güvenli hata aktif öncelikten çıkar.
- Üst ve alan ustalık göstergeleri Box 5 kullanır. Streak bugün/dün çalışma yoksa sıfır gösterilir. Focus Areas son üç quiz puanının ortalamasını kullanır; tarihsel en iyi puan ve tamamlanma kaydı değişmez.
- Quiz state v2, modüle ait soru ID'si ve soru/şık/doğru cevap içerik imzasını saklar. Şık ve soru sırası değişebilir; anlamlı içerik değişiminde eski grading kullanılmaz. Eski indeks kayıtları mevcut sıradan taşınır ve bu tarihsel sınır ekranda açıklanır. Dönüştürme/geçersiz kılma öncesi özgün kayıt recovery snapshot olarak yedekte korunur. Arşiv yazımı başarısızsa o oturumda quiz kayıtları üzerine yazılmaz ve hata bildirilir. Eski ve yeni yedek biçimleri doğrulanır.
- Asset query `20261002a`; service worker `quilyn-v46`. Bu kayıt yayın yapıldığını belirtmez.
- `npm run check`: **42/42 test başarılı**; 74 JavaScript dosyası, içerik ve manifest doğrulamaları başarılı. Kabuk 299,2 KB; 300 KB bütçesi korundu. `git diff --check` temiz.
- Testler gerçek PSSA havuzunda 15 farklı modülden seçim, tekrar kotası, öncelik, gelecek tarihli kartın dışlanması, Box 5, kopmuş streak, recent-score regresyonu, eski kayıt dönüşümü, sıralama/değişen içerik, yedek referansları ve arşiv kota hatasını kapsıyor.
- Ayrı localhost origin'de quiz cevabı/puanı yenileme sonrasında korundu; gerçek review oturumunda cevap, güven ve sonraki soru akışı çalıştı; 390 px genişlikte yatay taşma yoktu. Yakalanan console warning/error boştu. [Ekran görüntüsü](screenshots/learning-foundation-2026-10-02.png).
- Fiziksel cihaz ve gerçek ekran okuyucu testleri yapılmadı. Migration/sıralama senaryoları otomatik model testleriyle doğrulandı; gerçek tarayıcıda eski dosya import akışı bu pakette tekrar çalıştırılmadı. İlk doğrulama sırasında commit/push yapılmamıştı.


### Aşama 2 teslim kaydı

- **Deneme geçmişi:** Home ve öğrenme ekranlarından `#history`; quiz, mock, Smart Review ve yanlış tekrarı kayıtları. Her kayıt soru ve şık metni, doğru seçenekler, kullanıcı cevabı, açıklama, kaynak, track/modül/alan, içerik imzası, zaman, mod ve tamamlanma durumunu taşır. Tamamlanmış, aynı moddaki ve aynı içerik sürümündeki denemeler önceki sonuçla karşılaştırılır. Yeni sürüm öncesi soru düzeyinde geçmiş üretilmez.
- **Yanlışlar defteri:** `#mistakes`; track, aktivite, alan, aktif/çözülen durum, yüksek güvenli hata ve metin filtresi. Kaynak modülü bilinen mock soruları quiz/review sorularıyla aynı kimliği kullanır; eski mock soruları kanonik içerik imzasıyla ayrılır. Doğru tekrar aynı içerik sürümündeki hatayı çözer; eski deneme açıklamaları korunur. Aynı `Q1` ID'sini kullanan farklı modüller beş soruluk tekrar akışında çakışmaz.
- **Sınav modları:** Learning modunda duraklatma ve soru bazında kontrol; Exam simulation modunda kesintisiz süre ve teslim öncesi gizlenen açıklamalar/cevap kontrolü. Simülasyonun mutlak bitiş zamanı kaydedilir; sayfadan ayrılma ve yenileme süreyi uzatmaz. Sürdürme modu, cevapları, işaretleri, görünümü ve soru konumunu korur. Mobilde tek soru varsayılan; kullanıcı liste görünümüne geçebilir. İşaretle, önceki/sonraki ve cevaplanmış/işaretli durumuyla soru seçici eklendi. Bu yerel simülasyon, gözetimli sınav veya bağımsız readiness ölçümü değildir.
- **Kayıt güvenliği:** `quilyn_learning` doğrulanan yedek sözleşmesine, Settings export/import/reset kapsamına eklendi. Cihazda en fazla 50 deneme, 500 hata ve 2 MB UTF-8 veri tutulur; eski kayıtlar sınır nedeniyle çıkarılabilir. Kota hatası bildirilir; mevcut kayıtlar korunur. Bitmemiş bir denemeyi yeniden başlatma geçmişte “abandoned” olarak görünür. Mock içeriği değiştiğinde aktif kayıt üzerine yazmadan recovery snapshot alınır.
- **Smart Review track hatası:** Eski custom element'in disconnect işlemi yalnız kendi ekranını kapatır; shell teardown için `ReviewView` API'si eklendi. Geç gelen önceki-track yanıtları generation kontrolüyle dışlanır. Mock custom element'ine de aynı ekran sahipliği kontrolü uygulandı.
- **Yükleme:** Geçmişin JS/CSS'i ve Smart Review JS'i ihtiyaç anında yüklenir. İki geçmiş asset'i hazır olmadan öğrenme kayıt akışı başlamaz. Yükleme hatası görünür ve tekrar denenebilir. Asset query `20261002c`; son service worker `quilyn-v48`. Yayın yapıldığını belirtmez.
- **Son doğrulama:** `npm run check` **57/57 başarılı**; 75 JavaScript dosyası, tüm içerik/manifest kontrolleri geçti. Başlangıç kabuğu yaklaşık **280,2 KB**, 300 KB bütçesi korundu. `git diff --check` temiz. Gerçek 982 mock sorusunun tamamı snapshot/yedek doğrulama testinden geçti. Geçmiş ve çözülmüş hata kayıtlarının Settings export → progress import döngüsü otomatik testle doğrulandı.
- **Tarayıcı:** Ayrı localhost origin'de PSA → PSSA → PBA Smart Review havuzları F5 olmadan 730 → 203 → 293 karta geçti. Quiz yanlış cevabı → defter → doğru tekrar → Resolved akışı çalıştı. Smart Review yüksek güvenli hata filtresi ve mock yanlışları deftere aktarıldı. Simülasyonda Pause ve Check Answer görünmedi; sürdürmede süre azaldı ve işaret/konum/mod korundu. Teslim sonucu 1/50 ile geçmiş 1/50 eşleşti. Learning modunda Check Answer, Pause ve Resume çalıştı. 320/390 px genişliklerde yatay taşma gözlenmedi; işaretleme sonrasında klavye odağı korundu.
- **Offline:** Test sunucusu kapatıldıktan sonra cached shell yenilendi; PSSA Smart Review 203 kart, geçmiş, mock bankası, mobil simülasyon ve Learning modunda cevap kontrolü çalıştı. Bu test önceden yüklenmiş içerik içindir; ilk kez hiç indirilmemiş track'in offline açılacağı anlamına gelmez. Offline tarayıcı testi v47 ara pakette gerçekleştirildi; final v48 aynı cache mekanizmasını ve asset listesini kullanır. Son temiz tarayıcı oturumunda yakalanan console warning/error boştu.
- **Sınırlar:** Fiziksel iOS/Android ve VoiceOver/TalkBack testleri yapılmadı. Gerçek dosya indirme testinde tarayıcı aracının download event'i zaman aşımına uğradı; export/import veri döngüsü otomatik testle doğrulandı, gerçek dosya seçimiyle import bu teslimatta doğrulanmadı. İlk doğrulama sırasında commit/push yapılmamıştı.
- Görsel kanıtlar: [Smart Review track geçişi](screenshots/review-track-switch-2026-10-02.png), [mobil sınav modu](screenshots/exam-modes-mobile-2026-10-02.png), [Yanlışlar defteri](screenshots/mistakes-notebook-2026-10-02.png).


### Aşama 3 — İlk kişiselleştirme paketi

- `#plan`: track bazında sınav tarihi ve günlük süre. Vadesi gelen tekrarlar, aktif yanlışlar, son üç quiz sonucu ve tamamlanmamış mevcut modüllerden bütçeyi aşmayan öneriler. Gerekçe ve tahmini süre görünür; bugünlük atlama ve geri alma var. Tamamlanan track için kısa recap veya süreye sığan tam mock önerilir. Hazırlık yeterliliği iddiası üretilmez. 20/10 dakikalık başlangıç blokları ölçülmüş öğrenme süresi veya tüm sınav hazırlığını bitirme tahmini değildir.
- Modül yer imleri, son sekme ve Guide bölüm konumu; kaydedilen konuma dönme düğmesi. Açık Guide/Recap URL’si kaydedilen sekmenin önüne geçer. Üst araç çubuğuna kaydırmak son okuma bölümünü silmez.
- `quilyn_study` tercihler/yer imleri/konumlar Settings yedekleme, import ve reset kapsamındadır. Geçersiz tarih, süre, tekrar eden kimlik, prototip anahtarı ve kota hataları kontrol edilir. Bilinmeyen modül referansları import sırasında raporlanır ve korunur.
- Guide/Recap URL’si quiz kaydını ayrı anahtara yazmaz; modülün mevcut kayıt anahtarı kullanılır. Son tarayıcı testinde yanlış cevap ve grading yenilemeden sonra korundu, kayıt hata bildirimi yoktu.
- `npm run check`: 68/68 test başarılı; kaynak, içerik, manifest ve kabuk bütçesi kontrolleri geçti. `git diff --check` temiz. Asset query `20261002e`; service worker `quilyn-v50`.
- Tarayıcıda tarih/süre yenileme sonrasında korundu; track tercihleri ayrıştı; atlama, yer imi, son sekme ve Guide bölümüne dönüş çalıştı. 320/390 px yatay taşma yok; açık/koyu tema kontrol edildi. Test sunucusu kapalıyken plan ve kayıtlı tercihler açıldı; son cache sürümünde önceden yüklenen ders çevrimdışı açıldı. Yeni cache sürümü kurulmadan yüklenmiş dersin yeniden indirilmesi gerekebilir; hiç indirilmemiş içeriğin offline erişimi garanti edilmez.
- Fiziksel iOS/Android ve VoiceOver/TalkBack kontrolü yapılmadı. Yedek veri döngüsü otomatik testle doğrulandı; gerçek dosya indirme/import akışı yeniden test edilmedi.
- [Mobil çalışma planı](screenshots/study-plan-mobile-2026-10-02.png).


### Aşama 3 — Ders bağlantıları ve açıklama altyapısı

- PSSA’nın 25 modülündeki 203 quiz sorusu, sorunun kaynak URL’siyle Guide bölümünün referans URL’si birebir eşleştiği için ilgili bölüme bağlandı. 180 kaynaklı mock sorusunda aynı eşleştirme taşındı. Kararsız/fuzzy metin eşleşmesi kullanılmadı. Diğer track’lerde bölüm eşleştirmesi henüz yok; modül bağlantısı varsa Guide başlangıcına döner.
- `#track/module/guide/sectionId` bağlantısı ilgili sekmeyi açar, başlığı ekranın görünür alanına kaydırır ve klavye odağını başlığa taşır. Kaldırılmış bölüm ID’sinde sessizce yanlış bölüme gitmek yerine görünür bildirim ve mevcut Guide gösterilir. Bölüm ID’leri içerikte saklanır; sonraki yeniden sıralamalarda bu ID’ler korunmalıdır.
- Her seçeneğe özel açıklama, inceleme tarihi ve bölüm hedefi snapshot’a eklenir. Eski snapshot’lar geçerlidir; geçmiş açıklamalar yeni içerikle değiştirilmez. Cevap imzası aynı kaldığı için yalnız açıklama eklemek mevcut puanları sıfırlamaz. Quiz, Smart Review, mock cevap incelemesi, deneme geçmişi ve Yanlışlar defteri aynı gösterim işlevini kullanır. Simülasyonda teslim öncesi bu açıklamalar DOM’a eklenmez.
- İlk editoryal kapsam: **SSA-M01’in 8 sorusu / 32 seçenek**. Mock formlarındaki aynı 7 soruya açıklamalar taşındı. Kalan 195 PSSA sorusunda seçenek açıklamaları henüz yazılmadı; mevcut soru açıklamaları korunuyor. Diğer track’lerdeki seçenek açıklamaları da bekliyor. Açıklamalar mevcut sorular için yazılmış bağımsız çalışma notlarıdır; resmî sınav soruları değildir.
- Kaynak incelemesi 2 Ekim 2026: [Modular architecture and Enterprise reuse](https://academy.pega.com/topic/modular-architecture-and-enterprise-reuse/v1), [Class hierarchy structure](https://academy.pega.com/topic/class-hierarchy-structure/v1), [New Pega Platform applications](https://academy.pega.com/topic/new-pega-platform-applications/v1). Yanlış seçenek değerlendirmeleri, bu kaynaklardaki kapsamın sorunun senaryosuna uygulanmasıdır.
- Yakalanan mevcut bug: quiz grading `.show` ekliyordu, CSS ise `.answered` bekliyordu; açıklama ve verdict görünmüyordu. Kart artık answered + ok/no sınıflarını da alır. Yenilemeden sonra geri yüklenen yanlış cevabın açıklaması görünür.
- Otomatik doğrulama: 72/72 test; tüm 203 bölüm hedefi, kaynaklı mock eşleştirmesi, editoryal snapshot/yedek uyumluluğu, eski kayıt bağlantısı, geçersiz metadata ve HTML kaçış kontrolü. İçerik, asset, manifest ve kabuk bütçesi kontrolleri geçti. Son asset query `20261002g`; service worker `quilyn-v52`.
- Tarayıcı: quiz grading/yenileme → seçenek açıklaması → ilgili başlık; Yanlışlar defterinde snapshot açıklaması; Smart Review’den Log files bölümüne dönüş; simulation teslim öncesi açıklama sayısı 0, teslim ve Review answers sonrasında 3 açıklama paneli; mock Q59’dan ilgili başlığa dönüş; eski bölüm hedefinde bildirim. 390 px görünümde taşma yok, console warning/error boş. Fiziksel cihaz/ekran okuyucu ve bu pakette yeniden offline test yapılmadı.
- [Mobil açıklama ekranı](screenshots/lesson-feedback-mobile-2026-10-02.png). Push/yayın yapılmadı.


### Study plan erişimi — 2 Ekim 2026

Kullanıcının ders araç çubuğu geri bildirimi üzerine Study plan ve Bookmarks sol menüde ayrı, her ekran için kalıcı bağlantılara taşındı; Home ekranında da ayrı girişler var. Ders üzerinde yer imi ve yalnız anlamlı kayıt olduğunda Resume reading gösterilir. Kaydetme sonucu/hatası status ile duyurulur. Bookmarks bağlantısı doğrudan liste başlığına odaklanır; mobil seçim menüyü kapatır. Resume reading bölüm başlığına klavye odağını taşır. Bu yerleşim tasarım değerlendirmesidir; kullanıcı araştırmasıyla “en iyi” olduğu kanıtlanmadı.

72 test geçti; tarayıcıda kayıt/yenileme, listeye erişim, okuma konumu, 320 px taşma ve mobil menü kapanma kontrolü yapıldı. Güncelleme yerel, henüz commit/push yapılmadı. Asset query 20261002h; SW quilyn-v53. [Görünüm](screenshots/study-navigation-2026-10-02.png).


### Sabit çubukta Bookmark — 2 Ekim 2026

Kullanıcının önerisiyle Bookmark ders sekmeleriyle aynı sticky dış çubuğun sağına taşındı. Düğme tablist’in ve yatay kaydırılan sekme alanının dışındadır; ok tuşları/Home/End yalnız dört sekmeyi dolaşır. Masaüstünde ikon/metin ve mobilde erişilebilir ad/title ile 44×48 px ikon düğmesi kullanılır. Resume reading ders başlığının altında kalır. Durum aria-pressed ve canlı status ile iletilir.

72 otomatik test geçti. Tarayıcıda sayfa aşağı kaydırıldığında masaüstü çubuk top=81 px, mobil top=8 px; 320 px yatay taşma yok. Ekleme, yenileme sonrası korunma, kaldırma, End → Quick Recap ve ArrowRight → Study Guide doğrulandı. Console warning/error boş. Son asset query 20261002i ve SW quilyn-v54. Henüz commit/push yapılmadı. [Masaüstü](screenshots/sticky-bookmark-desktop-2026-10-02.png), [Mobil](screenshots/sticky-bookmark-mobile-2026-10-02.png).


### Resume reading doğrulaması ve sabit çubuk — 2 Ekim 2026

Kullanıcı isteğiyle Resume reading Bookmark’ın soluna, sticky dış çubuğa alındı. İki işlem tablist dışında durur; mobilde her biri 44×48 px dokunma alanıyla ikon gösterir. Kayıt yoksa Resume gizlidir.

Yakalanan sorun: okuma bölümünü seçmek için kullanılan sabit 150 px sınırı, masaüstünde geri dönülen başlığın konumundan küçük olabiliyordu; sonraki kayıtta önceki bölüm seçilebiliyordu. Sınır artık sabit çubuğun alt kenarı + 24 px üzerinden hesaplanır. Regresyon testi aynı bölüme dönüş ve tekrar kaydı, URL sekme önceliği, Resume ile quiz’e dönüş, ilerleme/mastery anahtarlarının değişmemesini kapsar.

74/74 otomatik test geçti. Ayrı localhost origin’de ilk ziyarette Resume gizli; ikinci Guide bölümüne kaydırma → yenileme → Resume ile Managing Personas and Channel interfaces başlığına dönüş; ikinci yenilemede aynı başlık korunması; quiz sekmesi → yenileme → Guide’a geçiş → Resume ile quiz’e dönüş doğrulandı. 320 px taşma yok; Resume Bookmark’ın solunda. Console warning/error boş. Gerçek cihaz/ekran okuyucu testi yapılmadı. Query 20261002j; SW quilyn-v55. Henüz commit/push yapılmadı. [Tarayıcı kanıtı](screenshots/resume-reading-2026-10-02.png).


### Ders çubuğu işlem renkleri ve kısa Resume etiketi — 2 Ekim 2026

Bookmark ve Resume için ders sekmelerinin mor renginden ayrışan petrol/turkuaz palet eklendi. Açık ve koyu tema; normal, hover, kayıtlı ve klavye odağı durumları tanımlandı. Kayıtlı Bookmark dolu ikon ve aria-pressed ile de belirtilir. Görünür etiket Resume; erişilebilir ad ve title Resume reading olarak kalır. Metin kontrastı tanımlı renk çiftlerinde en az 5.98:1.

74/74 otomatik test geçti. Tarayıcıda açık/koyu renkler, kısa etiket, kayıtlı Bookmark ve 2 px klavye odağı doğrulandı. 320 px görünümde yatay taşma yok; iki işlem 44×48 px. Konsol warning/error boş. Fiziksel cihaz ve ekran okuyucu testi yapılmadı. Query 20261002k; SW quilyn-v56. Henüz commit/push yapılmadı. [Açık tema](screenshots/lesson-actions-light-2026-10-02.png), [Koyu tema](screenshots/lesson-actions-dark-2026-10-02.png).


### Aşama 3 — Açıklama paketi 2: Versioning ve Rulesets

Önceki arayüz paketi 162ed9e ile yerel commit olarak kaydedildi. SSA-M02 ve SSA-M03 için 16 soru / 64 seçenek açıklaması eklendi; kaynak kimlikleriyle eşleşen 14 mock kopyasına taşındı. PSSA seçenek açıklaması kapsamı 24/203 soruya ulaştı; 179 soru ve diğer track’ler bekliyor. Bu açıklamalar kaynakların senaryolara uygulanmasına dayanan bağımsız editoryal değerlendirmelerdir. Soru/şık metni, doğru cevaplar ve bölüm hedeflerinin HEAD sürümüyle aynı kaldığı ayrıca doğrulandı; açıklama eklenmesi eski grading’i geçersiz kılmaz.

2 Ekim 2026 kaynak kontrolü: [Application versioning](https://academy.pega.com/topic/application-versioning/v6), [Application and production Rulesets](https://academy.pega.com/topic/application-and-production-rulesets/v7), [Ruleset validation](https://academy.pega.com/topic/ruleset-validation/v6), [The Ruleset list](https://academy.pega.com/topic/ruleset-list/v6). İçerikteki /in/... bağlantılarının bazıları araştırma aracında açılmadı; aynı sürümlerin topic sayfaları okunarak doğrulandı.

74/74 test geçti; içerik/manifest/kabuk bütçesi kontrolleri başarılı. PSSA tüm bölüm hedefleri ve kaynaklı mock açıklamalarının ders ile eşleşmesi kontrol edildi. Tarayıcıda SSA-M02 Q01 yanlış cevap → seçenek açıklamalarını açma → yenileme sonrası grading → ilgili Guide başlığına dönüş doğrulandı; başlık görünür alanda ve odaklı. Console warning/error boş. Bu içerik paketinde yeni fiziksel cihaz, ekran okuyucu veya offline testi yapılmadı. Query 20261002l; SW quilyn-v57. Push/yayın yapılmadı. [Görünüm](screenshots/pssa-versioning-feedback-2026-10-02.png).


### Aşama 3 — Açıklama paketi 3: Circumstancing ve Rule Resolution

SSA-M04 ve SSA-M05 için 16 soru / 64 seçenek açıklaması eklendi. 14 kaynak kimliği eşleşen mock kopyası güncellendi. Toplam 40/203 PSSA sorusu açıklamalı; 163 soru ve diğer track’ler bekliyor. Açıklamalar bağımsız editoryal yorumdur. Soru metinleri, seçenekler, doğru cevaplar, bölüm hedefleri ve diğer içerik alanlarının önceki commit ile aynı kaldığı doğrulandı.

2 Ekim 2026 kaynakları: [Circumstancing](https://academy.pega.com/topic/circumstancing/v4), [Circumstance Rules](https://academy.pega.com/topic/circumstance-rules/v6), [Single-variable](https://academy.pega.com/topic/single-variable-circumstancing/v5), [Multi-variant](https://academy.pega.com/topic/multi-variant-circumstancing/v5), [Purpose](https://academy.pega.com/topic/rule-filtering-purpose/v6), [Ranking](https://academy.pega.com/topic/remaining-rule-candidates-and-ranking/v6), [Resolution process](https://academy.pega.com/topic/rule-resolution-process/v7), [Availability](https://academy.pega.com/topic/rule-resolution-process-and-rule-availability/v7). Özellikle accessible Base flag, Withdrawn kapsamı, Not Available ile seçilmiş unqualified Blocked farkı kaynaklarla kontrol edildi.

74/74 test geçti; içerik, manifest ve kabuk kontrolleri başarılı. PSSA tüm bölüm hedefleri ve kaynaklı mock açıklamalarının derslerle eşleşmesi doğrulandı. Tarayıcıda SSA-M05 Q01 yanlış cevap sonrası dört seçenek açıklaması ve inceleme tarihi görünür; warning/error boş. Bu veri paketinde yeni mobil, fiziksel cihaz, ekran okuyucu ve offline testi yapılmadı; ortak arayüz değiştirilmedi. Query 20261002m; SW quilyn-v58. Kullanıcı talimatıyla push/yayın yapılmadı. [Görünüm](screenshots/pssa-resolution-feedback-2026-10-02.png).


### Aşama 3 — Açıklama paketi 4: Migration, SLA, Parallel Processing ve Case Locking

SSA-M06–M09 için 32 soru / 128 seçenek açıklaması eklendi; 29 kaynak kimliği eşleşen mock kopyası güncellendi. PSSA kapsamı 72/203; 131 soru ve diğer track’ler bekliyor. Açıklamalar bağımsız editoryal değerlendirmedir. Mevcut soru metinleri, şıklar, doğru cevaplar ve bölüm hedeflerinin HEAD sürümüyle aynı kaldığı karşılaştırılarak doğrulandı.

2 Ekim 2026 kaynakları: [Product Rule](https://academy.pega.com/topic/product-rule/v6), [Export wizard](https://academy.pega.com/topic/exporting-application-product-rule-or-ruleset-using-export-wizard/v6), [Delegated production packaging](https://academy.pega.com/challenge/exporting-application/v4), [Delayed SLA](https://academy.pega.com/topic/delayed-service-level-agreement-processing/v6), [Assignment urgency](https://academy.pega.com/topic/assignment-urgency/v5), [Parallel processing](https://academy.pega.com/topic/parallel-processing-pega-applications/v5), [Split Join](https://academy.pega.com/topic/running-multiple-instances-different-subprocesses-split-join-shape/v6), [Subprocess context](https://academy.pega.com/topic/adding-additional-configuration-subprocess/v6), [Case locking](https://academy.pega.com/topic/case-locking/v7). Split For Each v6 araştırma aracında açılmadı; [v5](https://academy.pega.com/topic/running-multiple-instances-same-subprocess-split-each-shape/v5) ve [resmî yardım](https://community.pega.com/sites/pdn.pega.com/files/help_v72/rule-/rule-obj-/rule-obj-flow/prm/prmsplitforeach.htm) üzerinden Any/All davranışı çapraz kontrol edildi; v6 okunmuş olarak işaretlenmedi.

74/74 test geçti; içerik, manifest, kabuk bütçesi ve diff kontrolleri başarılı. Tüm PSSA bölüm hedefleri ve kaynaklı mock açıklamalarının dersle eşleşmesi doğrulandı. Tarayıcıda SSA-M09 Q03 iki doğru seçenek ile grading ve dört seçenek açıklaması kontrol edildi; warning/error boş. Ortak arayüz değiştirilmedi; bu veri paketinde fiziksel cihaz, ekran okuyucu veya offline kontrol tekrarlanmadı. Query 20261002n; SW quilyn-v59. Kullanıcı talimatıyla push/yayın yapılmadı. [Görünüm](screenshots/pssa-concurrency-feedback-2026-10-02.png).
