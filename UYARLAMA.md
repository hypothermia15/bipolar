# Türkçe uyarlama notları

Bu depo, Michał Ciesielski'nin [Bipolar Attractors](https://github.com/ciessielski/bipolar) çalışmasının (MIT lisansı) Türkçe uyarlamasıdır. Uyarlayan: Doç. Dr. Miraç Barış Usta (Kasım 2026). Özgün yazar bu uyarlamayı incelemiş ya da onaylamış değildir.

Uyarlamanın dayandığı özgün sürüm: `91c96c1` (30 Temmuz 2026).

## Yapılan değişiklikler

- **Türkçe çeviri eklendi** (`src/locales/tr.json`): arayüz, özgün 15 madde/işlemin açıklamaları, lityumun ayrıntı bölümleri, uyarılar ve farmakoloji kartındaki etki mekanizması ile hedef notları. Uygulama Türkçe açılır; İngilizce, Lehçe ve Almanca sürümler dil seçicide durur.
- **Model ve klinik içerik değiştirilmedi.** Çukur derinlikleri, yarılanma ömrü, etki başlangıcı ve diğer parametreler (`src/data/`) özgün çalışmadaki gibidir; metinler birebir çevrilmiştir. Uyarlayanın eklediği değerlendirmeler özgün metne karıştırılmamış, “Uyarlayanın notu” kutularında ayrı tutulmuştur.
- **Dil seçimi adres yolundan sorgu parametresine alındı** (`?lang=en`) ve tarayıcıda hatırlanıyor. Böylece uygulama bir alt klasörden statik dosya olarak sunulabiliyor; `react-router-dom` bağımlılığı kaldırıldı, Vite `base: './'` ile derleniyor.
- **Sayfanın altına sürekli görünen bir uyarı ve künye eklendi:** eğitim amaçlı olduğu, özgün çalışma ve uyarlama bilgisi.
- **Okunabilirlik:** sol listedeki başlıkların ve ilaç adlarının yazı boyutu ile kontrastı artırıldı.
- **“Uyarlayanın notu” kutuları eklendi** (yalnızca Türkçe sürümde; lityum, haloperidol, lorazepam). Özgün metin birebir çevrilmiş, kanıtla tam örtüşmeyen dört ifade için not ve kaynak ayrı, renkli bir kutuda verilmiştir; kaynakların künyeleri PubMed kayıtlarından doğrulanmıştır.
- "Kaynak yayın" bağlantısının metni, bağlantının gittiği makalenin gerçek başlığı ve dergisiyle düzeltildi (Translational Psychiatry, 2022).
- ABD'ye özgü düzenleyici ifadeler (FDA kutulu uyarısı, Çizelge III/IV, REMS) çeviride "ABD'de" diye belirtildi.

- **Telefon görünümü** (yalnızca yerleşim ve yazı boyutu): 900 pikselin altında başlık ve manzara üstte, madde şeridi altında, açıklama en altta sıralanır; manzara üzerindeki etiketler ekran genişliğine göre ölçeklenir; dil düğmeleri, “Stresör” düğmesi ve küçük yazılar büyütüldü. Model ve metin değişmedi.

- **Metamfetamin eklendi (24 Kasım 2026).** Özgün çalışmada olmayan tek maddedir (`src/data/modifiers/methamphetamine.yaml`), "Psikoaktif Maddeler" grubunda yer alır. "Model ve klinik içerik değiştirilmedi" ilkesinin tek istisnasıdır ve Türkçe sürümde "Uyarlayanın notu" kutusuyla işaretlenmiştir.
  - Kaynağa dayananlar: yarılanma ömrü (yaklaşık 10 saat), doza bağlı etkiler, psikoz, kardiyovasküler ve nörotoksik riskler, yoksunluk (Cruickshank ve Dyer 2009, doi:10.1111/j.1360-0443.2009.02564.x; Glasner-Edwards ve Mooney 2014, doi:10.1007/s40263-014-0209-8; McGregor ve ark. 2005, doi:10.1111/j.1360-0443.2005.01160.x). Künyeler ve özetler PubMed kayıtlarından alındı; uyarılar özetlerdeki ifadelerle sınırlı tutuldu.
  - Farmakoloji kartı: ChEMBL kaydı CHEMBL1201201 (formül, molekül ağırlığı, QED, ilk onay yılı 1943, kutulu uyarı, "monoamin taşıyıcı inhibitörü" mekanizması). Hedef bazında Ki değerleri doğrulanmadığı için karta konmadı.
  - Uyarlayanın seçtiği temsili değerler: mani çukuru derinliği 2,9, depresyon çukuru 2,5, kaos 0,70, tepkisellik 16, etki başlangıcı 0,5 saat. Bunlar bir ölçüme dayanmaz; diğer maddelerin değerleriyle orantılı olacak biçimde seçildi.
  - Doğrulanmayan: bipolar bozukluğu olan kişilerde metamfetaminin gidişe etkisi için kaynak taranmadı. Lehçe ve Almanca sürümlerde metin İngilizce görünür.

## Sınırlılıklar

Eğitim amaçlı bir görselleştirmedir, tıbbi bir araç değildir. Parametreler basitleştirilmiş yaklaşık değerlerdir ve klinik yönlendirme niteliği taşımaz. Metinlerdeki klinik ifadeler özgün çalışmadan çevrilmiştir; güncel kılavuzlar ve Kısa Ürün Bilgisi ile tek tek doğrulanmamıştır.

## Yayın

`main` dalı kaynak kodu, `yayin` dalı `npm run build` çıktısını (statik dosyalar) içerir. miracbarisusta.com `yayin` dalını `/bipolar-manzarasi/` altında yayımlar.
