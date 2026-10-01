# Quilyn ürün ve mühendislik denetimi

Tarih: 1 Ekim 2026. Kapsam: statik PWA, 11 öğrenme yolu, `data/registry.json` içindeki 191 hazır modül, quiz, deneme sınavı, tekrar, arama ve ilerleme yedekleme. Bu belge bir marka taklidi önermez; büyük ürün ekiplerinde kullanılan tutarlılık, erişilebilirlik, güvenilirlik ve ölçülebilir ürün kararlarını Quilyn'e uygular.

## Ürün değerlendirmesi

Quilyn'in güçlü temeli: hesap gerektirmeyen kullanım, özgün modül içeriği, çoklu öğrenme yolu, tekrar ve deneme sınavı, açık kaynak kod, istemcide saklanan ilerleme. Bunlar korunmalı. Temel ürün problemi ise öğrenme deneyiminin kullanıcı hedefi etrafında yeterince yönetilmemesi. İlk ekran 19–48 kart sunuyor; kullanıcıya **bugün ne yapmalı, ne kadar sürecek, neye hazır, sıradaki adım ne** sorularını kısa yoldan yanıtlamıyor. İçerik hacmi büyüdükçe bu eksik daha görünür oluyor.

Görsel dilde koyu arka plan, mor/mavi gradyanlar, çizgiler, gölgeler, rozetler ve çok sayıda küçük metin aynı anda rekabet ediyor. Marka karakteri var; ama bilgi hiyerarşisi ve okunabilirlik, dekoratif yoğunluğun gerisinde kalıyor. Tasarımın hedefi daha fazla efekt değil, birincil eylemi ve ilerleme durumunu ilk bakışta anlaşılır kılmak olmalı.

## Doğrulanmış bulgular ve bu incelemede yapılan düzeltmeler

| Öncelik | Bulgu | Kullanıcı etkisi | Durum |
| --- | --- | --- | --- |
| P0 | `app-shell.js` ana ekrana geçişte `engine.js` tarafından çizilen içeriği temizliyordu. | Boş ana sayfa. | Düzeltildi; yerel tarayıcıda modül → ana sayfa akışı doğrulandı. |
| P0 | Quiz kaydı, tamamlanma işaretini eski state ile tekrar yazarak silebiliyordu. | İlerleme kaybı. | Tek state üzerinde güncelleme yapıldı; regresyon testi eklendi. |
| P1 | Eski modül isteği, hızlı gezinme sonrası yeni sayfanın üzerine çizilebiliyordu. | Yanlış içerik gösterimi. | İstek nesli kontrolü eklendi. |
| P1 | Deneme sınavı süresi `setInterval` sayısına bağlıydı. | Arka plan sekmesinde süre uzayabiliyordu. | Süre son tarih üzerinden hesaplanıyor; regresyon testi eklendi. |
| P1 | İlk ana ekran PBA gösterirken paylaşılan store PSA seçili kalabiliyordu. | Sınav/tekrar yanlış öğrenme yolunda açılabiliyordu. | Router ve store eşitlendi. |
| P1 | Service worker, zaman damgalı JSON isteklerinde önbelleği bulamıyordu; temel `store.js` de ön yüklemede yoktu. | Çevrimdışı açılış veya modül yüklemesi başarısız olabiliyordu. | URL anahtarı normalize edildi, uygulama kabuğu ve sınav bankası önbelleğe alındı. |
| P1 | Kartlar ve track seçici yalnızca tıklanabilir `div` idi. | Klavye ve yardımcı teknoloji kullanıcıları akışı tamamlayamıyordu. | Kartlar bağlantı, seçici düğme oldu; odak ve Escape davranışı eklendi. |
| P2 | Arama verisi yüklenmeden yazılan sorgu yükleme sonunda tekrar işlenmiyordu. | Kullanıcı sonuç görmek için tekrar yazmak zorunda kalabiliyordu. | Yükleme sonrası sorgu yeniden işleniyor; hata durumu ve odak dönüşü eklendi. |
| P2 | İlerleme yüzdesinin paydası hazır olmayan modülleri de içeriyordu. | Yanlış ilerleme gösterimi. | Hazır modüller üzerinden hesaplanıyor. |
| P2 | PSA alan çubukları BA ve SA modüllerini birlikte sayabiliyordu. | Alan toplamları öğrenme yolu toplamını aşabiliyordu. | Alanlar etkin yolun hazır modüllerinden türetiliyor. |
| P0 | İçe aktarma bilinmeyen anahtarları kabul ediyor ve hatalı dosyada kısmi yazım yapabiliyordu; tema dışa aktarılmıyordu. | Veri kaybı veya eksik yedek. | Temel biçim/anahtar ve boyut kontrolü, yazım hatasında geri yükleme, tema yedeği eklendi. |

## Açık kalan ürün ve teknik borç

| Öncelik | Kanıt / alan | Öneri ve kabul ölçütü |
| --- | --- | --- |
| P1 | İçe aktarma artık temel doğrulama ve geri yükleme yapıyor, ancak iç içe ilerleme verisinin tam şeması ve üzerine yazılacak kapsamın önizlemesi yok. | Tam JSON şeması, içe aktarma önizlemesi ve açık onay; büyük bir gerçek kullanıcı yedeğiyle uçtan uca test. |
| P1 | `engine.js`, `app-shell.js` ve `enhancement.js` aynı DOM ve hash rotası üzerinde ayrı sahiplik kuruyor. | Tek yönlendirici ve tek ekran yaşam döngüsü; modül, sınav, tekrar ve geri/ileri gezinme testleri. |
| P1 | `core/css/theme.css` yaklaşık 2700 satır; yinelenen kurallar ve çok sayıda görünüşe özgü yama içeriyor. | Tokenlar, temel bileşenler ve ekran stillerini ayır; kullanılmayan seçicileri kaldır; açık/koyu tema için kontrast denetimi yap. |
| P1 | Kayıtlı modül JSON'ları yaklaşık 4,64 MB; registry ve sınav bankasıyla 5,35 MB. Tüm modüller önbelleğe alınmıyor. İlk 57 MB ölçümü Git'e dahil olmayan yerel kurs varlıklarını da içeriyordu ve ürün paketini temsil etmiyordu. | 'Çevrimdışı indir' akışı, yol bazlı paket boyutu, indirme ilerlemesi ve depolama sınırı uyarısı. Açılış ekranı çevrimdışı çalışmalı; indirilmemiş modül açıkça belirtilmeli. |
| P1 | `settings.js` etkinlik ısı haritasını `dueDate` üzerinden geçmiş çalışma günü gibi yorumluyor. | Gerçek çalışma olaylarını ayrı kayıtla tut; geçmiş tarihleri tahmin etme. Saat dilimi ve gün sınırı testleri ekle. |
| P1 | `engine.js` modül tamamlanmasını %70'e bağlıyor, registry'deki sınav geçme eşiği ise bazı yollarda %65. | 'Modül ustalığı' ile 'sınav geçme' ölçütlerini ayrı adlandır; eşikleri ürün kararı olarak tanımla ve her yerde aynı terimleri kullan. |
| P1 | Modül kartları ve içerik, tek ekranda çok sayıda eş ağırlıklı seçenek sunuyor. | Ana sayfada 'Devam et', 'Bugünkü tekrar', 'Sınava hazır oluş' ve 'Tüm modüller' sırası; kullanıcı testiyle ilk eylem süresini ölç. |
| P1 | Quiz, sınav ve ayar pencerelerinde odak yönetimi tutarlı değil. | Tüm modal akışlar için odak tuzağı, açan düğmeye dönüş, Escape, görünür hata bildirimi ve ekran okuyucu duyuruları. |
| P2 | `index.html` CDN font/CSS kullanıyor; çevrimdışı ilk kurulum ve görünüş kaynaklara bağlı. | Kritik stilleri yerelleştir; performans ve lisans etkisini değerlendir. |
| P2 | CSP `unsafe-inline` içeriyor; modül verilerindeki bağlantılar için URL şeması beyaz listesi yok. | Inline kod/stilleri aşamalı taşı; yalnızca `https:` ve gerekli yerel şemaları kabul et; içerik üretiminde statik doğrulama ekle. |
| P2 | Hazırlıkta paket manifesti, içerik doğrulayıcı, tek komutluk JS/test kapısı ve Quality CI iş akışı eklendi. Yerel koşu geçti; GitHub koşusu henüz yapılmadı. | İçerik doğrulamasını tüm nested alanlara genişlet; erişilebilirlik ve çevrimdışı tarayıcı testlerini yayın kapısına bağla. |

## Önerilen tasarım sistemi

1. **İçerik hiyerarşisi:** Her ekranda bir başlık, bir birincil eylem, en fazla birkaç ikincil eylem. Kartları öğrenme amacı, süre ve durumla etiketle; görsel süslemeleri azalt.
2. **Bileşen sözlüğü:** Button, link card, progress, status badge, dialog, tab, quiz option, feedback ve empty/error state için ortak davranış. Her bileşenin hover, focus, disabled, loading ve hata halleri tanımlı olsun.
3. **Tokenlar:** Nötr yüzeyler, tek ana vurgu, semantik başarı/uyarı/hata renkleri, 8 px aralık ölçeği, tipografi ve yükselti. Açık/koyu temada aynı anlam korunmalı.
4. **Okunabilirlik:** Uzun çalışma metinlerinde satır uzunluğu ve gövde puntosu artırılmalı; 11–12 px yalnızca yardımcı etiketlerde kullanılmalı. WCAG 2.2 AA kontrast ve hedef boyutu denetlenmeli.
5. **Güven:** Her modülde kaynak, son gözden geçirme tarihi, sınav sürümü, kapsam ve resmî olmayan içerik işareti net görünmeli. Hazır olmayan sınavlar açıkça ayrılmalı.

## Teslim sırası

İş paketleri, bağımlılıklar ve kabul ölçütleri [uygulama planında](implementation-plan.md); görsel/etkileşim hedefleri [tasarım sözleşmesinde](design-system-spec.md); test kapsamı [doğrulama planında](verification-plan.md) tanımlıdır.

| Aşama | Süre tahmini | Çıktı | Başarı ölçütü |
| --- | --- | --- | --- |
| 1. Güvenilir temel | 1–2 hafta | İçe aktarma doğrulaması, router sahipliği, test/CI, çevrimdışı smoke testi. | Kritik akışlarda veri kaybı ve boş ekran yok; testler her değişiklikte çalışıyor. |
| 2. Tasarım sistemi | 2–3 hafta | Token ve bileşen envanteri, klavye ve ekran okuyucu düzeltmeleri, responsive düzen. | WCAG 2.2 AA denetiminde kritik/major ihlal yok; 320–1440 px taşma yok. |
| 3. Öğrenme deneyimi | 2–4 hafta | Hedef odaklı ana sayfa, devam akışı, öğrenme planı, gerçek etkinlik kayıtları. | İlk anlamlı eyleme ulaşma süresi ve modül tamamlama oranı kullanıcı testinde iyileşiyor. |
| 4. İçerik ve performans | Sürekli | Kaynak/sürüm kalite kapısı, modül bazlı çevrimdışı indirme, performans bütçesi. | Güncel kaynak kapsamı izleniyor; ilk yükleme ve offline davranış cihaz testlerinde tutarlı. |

Bu tahminler tek geliştiricinin uygulama eforu içindir; içerik doğrulaması ve kullanıcı araştırması ayrı planlanmalıdır. “Enterprise” kalite yalnızca görünüşle elde edilmez; ürün kararları, ölçüm, erişilebilirlik, içerik doğruluğu ve değişiklik güvenliği birlikte yönetilmelidir.

## Tasarım araştırması kaynakları

- [Apple Human Interface Guidelines — Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility): erişilebilir, anlaşılır ve uyarlanabilir etkileşimler.
- [Google Design — Leading by Design](https://design.google/library/leading-by-design): ortak tasarım dili ve kullanıcı odaklı basitlik.
- [Amazon Cloudscape — Foundation](https://cloudscape.design/foundation/): rolü belli renk, yoğunluk, aralık ve hareket ilkeleriyle tutarlı kurumsal arayüz.
- [OpenAI — What we're optimizing ChatGPT for](https://openai.com/index/optimizing-chatgpt/): ekranda geçirilen süre yerine kullanıcının görevini tamamlamasını merkeze alma; Quilyn için bu, öğrenme hedefi ve ilerleme ölçütlerine çevrilmiştir.
- [Anthropic — Claude Design](https://www.anthropic.com/news/claude-design-anthropic-labs): seçenekleri hızla prototipleme ve görsel çalışma üzerinde yineleme yaklaşımı; Quilyn'de kullanıcı testli tasarım denemeleri için ilham kaynağıdır.
- [W3C WCAG 2.2 — Keyboard Accessible](https://www.w3.org/WAI/WCAG22/Understanding/keyboard-accessible.html), [Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum), [Contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html): denetlenebilir erişilebilirlik ölçütleri.
- [Chrome for Developers — Caching strategies](https://developer.chrome.com/docs/workbox/caching-strategies-overview): çevrimdışı veri ve uygulama kabuğu için ağ/önbellek stratejileri.

## Uygulama sonrası kayıt

Bu denetimin uygulama backlog'u 1 Ekim 2026 tarihinde kodlandı. Güncel doğrulama, çözümler ve açık yayın/içerik işleri için [uygulama sonuçları](implementation-results.md) esas alınmalıdır.
