# Quilyn — Senior System Architect hazırlık analizi

Analiz tarihi: 28 Eylül 2026. Durum: kaynak/kapsam ve kod incelemesi tamamlandı;
İlk uygulama güncellemesi: Application Development Intermediate için 6 ders,
18 topic, 18 örnek ve 48 özgün soru eklendi. Kalan 19 ders ve tam kapsamlı
mock sınavlar bekliyor.

## Resmî kaynaklar ve sürüm

- [Senior System Architect v8](https://academy.pega.com/mission/senior-system-architect/v8): Pega Platform '25. URL'deki v8, Platform 8 anlamına gelmiyor.
- [SSA '25 sınavı](https://academy.pega.com/exam/certified-pega-senior-system-architect-6): PEGACPSSA25V1, 60 soru, 90 dakika, %70 geçme eşiği.
- [Application Development Intermediate](https://academy.pega.com/mission/application-development-intermediate/v6/in/92306)
- [Case Management Intermediate](https://academy.pega.com/mission/case-management-intermediate/v7/in/92306)
- [Data and Integration Intermediate](https://academy.pega.com/mission/data-and-integration-intermediate/v7/in/92306)

Ana mission 3 alt mission ve doğrudan 9 modül içeriyor. Alt mission'lardaki
6 + 5 + 5 modülle toplam 25 konu modülü çıkıyor. Ana sayfa iç içe eğitimler
dahil toplam süreyi 44 saat 55 dakika olarak veriyor. Sayfa sayaçları ile
listelenen challenge'lar her yerde birebir örtüşmüyor: Case Management sayfası
5 challenge sayarken listesinde 6 challenge bağlantısı bulunuyor. Envanterde
sayaç yerine gerçek bağlantılar esas alınmalı; sürelerden yeni toplam türetilmemeli.

## Mevcut proje

Quilyn bağımlılık/build adımı gerektirmeyen statik HTML/CSS/JavaScript SPA.
Registry track ve ders listesini; ayrı JSON dosyaları ders içeriğini sağlıyor.
Mevcut Pega içerikleri İngilizce; SSA için de aynı dil ve teknik terimler öneriliyor.

| Track | Modül | Practice quiz sorusu | Mock sınav |
| --- | ---: | ---: | --- |
| PBA | 19 | 293 | 3 × 50 soru |
| PSA | 48 | 730 | 6 × 60 soru |

Registry toplam 10 track ve 185 ders kaydı içeriyor. README'deki Tosca AS1/AS2
sayısı registry kayıtlarıyla aynı değil; ileride dokümantasyon güncellemesinde
giriş ve referans bölümlerinin nasıl sayıldığı netleştirilmeli.

Ortak ders alanları: `moduleId`, `moduleTitle`, `moduleUrl`, `moduleQuizUrl`,
`learningObjectives`, `estTime`, `studyGuide`, `examPitfalls`, `practiceQuiz`,
`quickRecap`, `topics`. Study Guide kavram kartları, analojiler, örnekler ve
SVG diyagramlarını destekliyor. Quiz şeması `single-select` / `multi-select`,
seçenek kimlikleri, doğru seçenekler, ipucu ve gerekçe içeriyor.
Mock bankası farklı, kısa alan isimleri kullanıyor: `d`, `t`, `q`, `o`, `a`, `r`.

## Önerilen SSA ders sırası

Aşağıdaki adlar resmî mission listelerinde doğrulandı. ID'ler öneridir;
henüz registry'ye eklenmedi. Modül/topic URL'leri üretim sırasında resmî
bağlantılardan alınmalı; sürüm ve quiz URL'leri tahmin edilmemeli.

| Önerilen ID | Resmî modül | Grup / sınav domain'i |
| --- | --- | --- |
| SSA-M01 | Creating a Pega Platform application | Application Development |
| SSA-M02 | Application versioning | Application Development |
| SSA-M03 | Application Rulesets | Application Development |
| SSA-M04 | Circumstancing Case processing | Application Development |
| SSA-M05 | Rule resolution | Application Development |
| SSA-M06 | Application migration | Application Development |
| SSA-M07 | Extending Service-Level Agreement configurations | Case Management |
| SSA-M08 | Parallel processing | Case Management |
| SSA-M09 | Managing concurrent Case access | Case Management |
| SSA-M10 | Flow Action processing | Case Management |
| SSA-M11 | Organization records | Case Management |
| SSA-M12 | Field values | Data and Integration |
| SSA-M13 | Validating data against a pattern | Data and Integration |
| SSA-M14 | Keyed Data Pages | Data and Integration |
| SSA-M15 | Exchanging data with other applications | Data and Integration |
| SSA-M16 | Integration errors | Data and Integration |
| SSA-M17 | Access control | Security |
| SSA-M18 | Securing and auditing data | Security |
| SSA-M19 | Define run-time settings | System Administration |
| SSA-M20 | Activities and Automations | Application Development |
| SSA-M21 | Background processing | Application Development |
| SSA-M22 | Measuring system performance | System Administration |
| SSA-M23 | Reviewing log files | System Administration |
| SSA-M24 | Debugging system performance | System Administration |
| SSA-M25 | Extending UI options | User Experience |

Bu domain eşlemesi bir uygulama önerisi. Dersler birden fazla sınav hedefini
destekleyebilir; quiz sorusu düzeyinde domain/hedef eşlemesi ayrıca yapılmalı.
Challenge'lar ilgili dersin uygulama bölümü olarak bağlanmalı. SOAP connector,
Pega API, locking, parallel processing, skimming, ABAC/RBAC, background processing,
performans ve DX API alıştırmaları için özgün kontrol listeleri hazırlanabilir.

## Sınav dağılımı

Resmî sınav yüzdelerinden hesaplanan 60 soruluk deneme hedefi:

| Domain | Resmî ağırlık | Önerilen soru sayısı |
| --- | ---: | ---: |
| Application Development | %30 | 18 |
| Case Management | %20 | 12 |
| Data and Integration | %20 | 12 |
| User Experience | %5 | 3 |
| System Administration | %15 | 9 |
| Security | %10 | 6 |

Bu sayılar Quilyn denemesi için tasarım hedefidir; gerçek sınavın her oturumunda
kesin soru sayısı garantisi değildir. En az 3 özgün deneme ve ders başına
yaklaşık 12–18 senaryo sorusu başlangıç hedefi olarak uygun.

## Gerekli teknik işler

1. `data/registry.json`: önerilen `PSSA` track'i, `SSA-Mxx` kimlikleri ve
   `data/senior-system-architect/` dosyaları. Yalnızca içerik kontrolü biten
   dersler `ready: true` olmalı. Track switcher ve router registry tabanlı.
2. `core/js/mock-view.js`: %65 ve 90 dakika sabitleri ile kart, sonuç,
   sidebar tamamlanma işaretleri ve açıklamalar track ayarlarından okunmalı.
   SSA %70 olmalı; mevcut track davranışları korunmalı. Görsel domain başarı
   renklerindeki %65 kullanımının da sınav eşiğiyle ilişkisi gözden geçirilmeli.
3. `core/js/review-view.js`: sabit `MOD_DOMAIN`, `DOMAINS`, `DCOLORS` tabloları
   SSA'yı ve System Administration domain'ini kapsamıyor. Domain bilgisini
   registry/ders metadata'sından okumak tekrar eden tabloları azaltabilir.
4. `core/js/enhancement.js`: domain haritası ve domain ilerleme çubukları PSA'ya
   özel. SSA için kapsam genişletilmeli; yalnız JSON eklemek yeterli değil.
5. ID tutarlılığı: PBA dosyaları registry ile aynı ID'yi kullanırken PSA'daki
   48 dosya `m01` gibi ID'ler kullanıyor; registry `SA-M01` kullanıyor.
   SRS `data.moduleId || meta.id` seçtiği için mevcut sabit domain haritasıyla
   eşleşme sorunu var. SSA'da registry ve dosya ID'leri birebir aynı olmalı.
   Eski PSA ID'lerini değiştirmek mevcut SRS kayıtlarının geçişini gerektirir;
   SSA hazırlığı için eski kullanıcı ilerlemesi değiştirilmemeli.
6. `data/mock-exams.json`: `PSSA` bankası ve domain dengesi. Mevcut PSA bankası
   üçüncü taraf soru kaynaklarına da bağlantılar içeriyor. SSA soruları kullanıcının
   talebi doğrultusunda resmî Academy konularından özgün olarak hazırlanmalı.
7. `sw.js`: statik varlıklar cache-first, JSON network-first. Kod yayına
   çıktığında cache sürümü güncellenmeli. Ders JSON'ları ziyaret edildiğinde
   cache'e giriyor; tüm SSA derslerinin ilk ziyarette offline hazır olduğu varsayılmamalı.
8. README: track, modül sayısı, %70 SSA eşiği ve kaynak bilgileri güncellenmeli.

## İçerik hazırlama ve kontrol sırası

Önce her modülün topic, quiz ve challenge bağlantıları ile öğrenme hedefleri
toplanmalı. Ardından resmî sınavdaki tüm maddelerle bir kapsam matrisi kurulmalı.
Özellikle class hierarchy/enterprise reuse, case attachments, encryption,
grouping fields ve resource settings gibi maddelerin hangi topic içinde
karşılandığı doğrulanmalı; sadece modül başlığından kapsam tamamlandı denmemeli.

İlk üretim grubu Application Development Intermediate'ın 6 dersi olabilir.
Her ders mevcut şablonla özgün İngilizce anlatım, senaryo, tuzaklar, açıklamalı
sorular ve hızlı tekrar içermeli. Academy quiz veya sınav soruları kopyalanmamalı.
Her açıklamanın hangi resmî topic'e dayandığı üretim kaydında tutulmalı.

İçerik kontrolü: JSON parse, dosya yolları, benzersiz ID'ler, geçerli seçenekler,
single/multi seçim kuralları, kaynak bağlantıları ve sınav hedefi kapsamı.
Uygulama kontrolü: track değiştirme, ders render, quiz, SRS domain filtreleri,
ilerleme kaydı, %70 sınav sınırı, mock domain dağılımı ve offline davranış.
İlk analiz aşamasında kod/ders içeriği değiştirilmedi ve UI çalıştırılmadı; o aşamanın bulguları
dosya incelemesi ve herkese açık resmî kaynak kontrolüne dayanıyor.

## İlk grup uygulama doğrulaması

Altı ders tarayıcıda açıldı; örnekler ve resmî kaynak bağlantıları görüntülendi.
Quiz sekmesi single/multi soruları render etti. Smart Review 48 kartı
Application Development altında yükledi. SSA mock ekranı %70 eşiğini ve
soru bankasının henüz hazır olmadığını gösteriyor. Kod tabanlı sınır kontrolü:
SSA 41/60 başarısız, 42/60 başarılı; PSA 39/60 başarılı. JSON, kimlik,
seçenek ve kaynak eşlemeleri ile JavaScript sözdizimi kontrol edildi.
Offline ve tüm quiz/SRS puanlama akışları bu grupta uçtan uca doğrulanmadı.

Mevcut modül/topic bağlantıları 28 Eylül 2026 tarihinde incelendi. Academy
bazı paylaşılan modüllerde ’26 etiketiyle birlikte ’25 uygulanabilirliğini
gösteriyor; kimi practice bağlantıları ’24.2 etiketi taşıyor. Quiz URL’leri
resmî modül bağlantılarından alındı; Academy quiz içerikleri kopyalanmadı.
