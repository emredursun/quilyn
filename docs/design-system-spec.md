# Quilyn tasarım ve etkileşim sözleşmesi

Durum: uygulama öncesi tasarım hedefleri. Mevcut ekranların bu ölçütleri tamamen sağladığı iddia edilmez. Backlog: [uygulama planı](implementation-plan.md).

## Bilgi mimarisi

| Ekran | Birincil görev | Görünür bilgi | Önemli durumlar |
| --- | --- | --- | --- |
| Ana sayfa | Seçili yolda çalışmaya devam et | Son modül, bugünkü tekrar, modül kapsamı ve son deneme sonucu | İlk ziyaret, ilerleme yok, tekrar yok, eksik yol |
| Modül | Öğren ve kendini sınama | Amaç, tahmini süre, içerik sekmeleri, kaynak/sürüm, ustalık | Yükleniyor, offline erişilemiyor, içerik hatası |
| Quiz | Yanıtla ve nedenini öğren | Seçim sayısı, yanıt durumu, açıklama, sonuç | Tek/çok seçim, yanıt bekliyor, yanıt kontrol edildi, kayıt hatası |
| Deneme | Süreli sınavı tamamla | Track, geçme eşiği, süre, soru konumu, boş/işaretli sorular | Başlangıç, devam, mola, süre bitti, sonuç, bankası yok |
| Tekrar | Bugünün kartlarını gözden geçir | Kart sayısı, alan, yanıt/açıklama, güven geri bildirimi | Tekrar yok, cevap açıldı, oturum bitti |
| Ayarlar | Görünüşü, veriyi ve offline içeriği yönet | Yedek kapsamı, import önizleme, indirilen paketler | Başarılı, bozuk yedek, kota, kesilen indirme |

Ana sayfa tek bir önerilen eylem sunar; tüm modüller erişilebilir kalır. “Tamamlandı”, “modül ustalığı”, “deneme sonucu” ve “tekrar gerekiyor” farklı durum etiketleridir. Eksik sınav kapsamı yüzdeyle gizlenmez. Süre tahmini bilinmiyorsa uydurulmaz.

## Token ve görsel kurallar

- Token aileleri: yüzey (canvas/surface/raised), metin (primary/secondary), border, accent, success/warning/danger, focus; spacing, type, radius ve shadow. Renk değerleri kontrast ölçümünden sonra kesinleştirilir.
- Aralık ölçeği: 4, 8, 12, 16, 24, 32, 48 px. Sayfa düzeni 8 px ritmini kullanır; 4 px yalnızca küçük bileşen ayrıntılarında kullanılır.
- Gövde için başlangıç hedefi 16–18 px, satır yüksekliği 1,5–1,7; uzun içerik yaklaşık 60–75 karakter satır genişliğinde. Yardımcı metin okunabilirliğini korur; ana bilgi küçük rozete taşınmaz.
- Bir ana vurgu rengi; durum renkleri semantik amaçla kullanılır. Sonuç/uyarılar metin ve gerektiğinde ikonla anlatılır; renk tek gösterge değildir.
- Açık/koyu temada normal metin en az 4,5:1, büyük metin ve anlamlı kontrol sınırları en az 3:1 kontrast hedefler. Her gerçek renk çifti ölçülür.
- Dokunma hedefi ürün hedefi olarak en az 44×44 CSS px. WCAG 2.2 AA'nın minimum hedef boyutu ve istisnaları ayrıca denetlenir. Komşu hedefler birbirine yapışmaz. [W3C hedef boyutu ölçütü](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).
- Görünür odak sabit biçimde çizilir ve sticky alanlarca örtülmez. Hover bilgiye ulaşmanın tek yolu olmaz.
- Hareket kısa ve işlevsel olur; `prefers-reduced-motion` tercihi gözetilir. Dekoratif animasyon sınav sırasında dikkati bölmez.

## Bileşen sözleşmeleri

| Bileşen | Semantik ve davranış | Gerekli durumlar |
| --- | --- | --- |
| Button | Eylem için native button; açıklayıcı erişilebilir ad; loading sırasında tekrar çalıştırma engellenir | Default, hover, focus, disabled, loading |
| Link / modül kartı | Gezinme için gerçek href; metin, süre ve durum; iç içe interaktif öğe yok | Default, focus, active, unavailable |
| Dialog | Adlandırılmış dialog; arka plan etkileşimi engelli; uygun başlangıç odağı; odak içeride; kapanınca tetikleyiciye dönüş | Open, validation error, working, closed |
| Tab | Tablist/tab/tabpanel ilişkisi; ok tuşları ve Home/End; seçili durum ve odak ayrı izlenir | Selected, focused, disabled |
| Quiz option | Tek seçim radio, çok seçim checkbox; grup soru ile adlandırılır; seçim sayısı yazılıdır | Unselected, selected, correct, incorrect, locked |
| Feedback | Başarı/hata metni ilgili alana bağlı; sonucun canlı duyurusu odağı zorla taşımaz | Success, warning, error |
| Progress | Pay/payda ve neyin ölçüldüğü görünür; bilinmeyen değer yüzdeye çevrilmez | Empty, partial, complete, unavailable |
| Loading / empty / error | Ne olduğu ve sonraki eylem açıklanır; retry veri silmez | Loading, no content, offline miss, retry, storage error |

Dialog Escape davranışı riske göre tanımlanır: sıradan panel kapanır; sınavı bırakma gibi veri etkili eylem açık onay ister. Görünen kapatma kontrolü her zaman bulunur. Quiz kısayolları metin alanlarına yazmayı engellemez ve ilgili ekran unmount olduğunda kaldırılır.

## Responsive ve kabul

320, 390, 768, 1024 ve 1440 CSS px başlangıç test genişlikleridir; bunlar katı CSS breakpoint kararı değildir. Küçük ekranda sidebar drawer'a dönüşür; modül ve cevap metinleri kesilmez. 200% zoom ve 400% reflow ayrıca test edilir. Kaydırma, daraltılabilir tablolar dışında sayfanın tamamında yatay taşma oluşturmaz.

İlk pilot: ayarlar dialog'u + quiz cevap/feedback bileşeni. Açık/koyu tema, klavye, VoiceOver ve küçük ekran doğrulandıktan sonra diğer ekranlar geçirilir. Her pilotun önce/sonra görseli aynı viewport'ta incelenir. Geçiş bitene kadar eski CSS kuralları yalnızca kullanım kanıtıyla kaldırılır.

## Kullanılabilirlik araştırması

İlk çalışma için 5 katılımcıyla şu görevler önerilir: yol seçip ilk modüle girme; ertesi gün kaldığı yerden devam; çok seçimli soruyu yanıtlama; bugünkü tekrarı bulma; yedeği geri yükleme; offline kapsamı anlama. Tamamlama oranı, ilk anlamlı eylem süresi, hata sayısı ve yardım ihtiyacı kaydedilir. Bu çalışma yön gösterir; tek başına istatistiksel başarı kanıtı değildir. Tasarım öncesi başlangıç değeri ölçülmeden iyileşme yüzdesi raporlanmaz.
