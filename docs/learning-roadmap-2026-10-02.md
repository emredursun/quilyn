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

Aşama 1 ve Aşama 2 kodlandı ve yerel olarak doğrulandı. Aşama 3–4 henüz uygulanmadı. Sıradaki paket çalışma planı ve kişiselleştirmedir. Aşama 1–2 yerel commit paketi olarak hazırlanmıştır. Push/yayın yapılmamıştır.

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
