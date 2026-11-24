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

- **Altı kayıt daha eklendi (24 Kasım 2026, kullanıcı isteği).** Hiçbiri özgün çalışmada yoktur; her biri Türkçe sürümde "Uyarlayanın notu" kutusuyla işaretlidir. Uyarılar yalnızca aşağıdaki kaynakların PubMed özetlerindeki ifadelere dayanır. Çukur derinlikleri, yarılanma ömrü ve etki başlangıcı uyarlayanın seçtiği temsili değerlerdir.
  - **Karbamazepin** (duygudurum dengeleyiciler): mani çukuru 1,3. Weisler ve ark. 2005, doi:10.4088/jcp.v66n0308; Chung ve ark. 2004, doi:10.1038/428486a. İdame ve bipolar depresyon için kaynak taranmadı.
  - **Lurasidon** (atipik antipsikotikler): depresyon çukuru 1,2, mani çukuru ve bariyer değişmez. Loebel ve ark. 2014, doi:10.1176/appi.ajp.2013.13070984; DelBello ve ark. 2022, doi:10.1016/j.jaac.2021.03.021.
  - **Antidepresan (SSRI)** (yeni grup: maniye kaydırabilen ilaçlar): mani çukuru 2,6, depresyon çukuru 1,5. Viktorin ve ark. 2014, doi:10.1176/appi.ajp.2014.13111501; Pacchiarotti ve ark. 2013, doi:10.1176/appi.ajp.2013.13020185. Sınıf olarak temsil edilir, farmakoloji kartı yoktur.
  - **Metilfenidat** (aynı grup): mani çukuru 2,6, kaos 0,30. Viktorin ve ark. 2017, doi:10.1176/appi.ajp.2016.16040467. Çalışma erişkinlerdedir; çocuk ve ergenler için kaynak taranmadı.
  - **Kortikosteroid** (aynı grup): mani çukuru 2,7, depresyon çukuru 2,4. Warrington ve Bostwick 2006, doi:10.4065/81.10.1361. Bipolar bozukluğa özgü değildir.
  - **Uyku yoksunluğu** (yeni grup: tetikleyiciler): mani çukuru 2,8, depresyon çukuru 1,5. Lewis ve ark. 2017, doi:10.1192/bjp.bp.117.202259; Boland ve ark. 2017, doi:10.4088/JCP.16r11332.
  - Farmakoloji kartları (karbamazepin CHEMBL108, lurasidon CHEMBL1237021, metilfenidat CHEMBL796) ChEMBL kayıtlarından alındı; hedef bazında Ki değerleri konmadı.
  - Model birden çok maddeyi ağırlıklı ortalamayla harmanlar. Antidepresan ya da metilfenidat lityumla birlikte açıldığında mani çukuru başlangıç değerinin altına iner; bu, kayıt çalışmalarındaki "duygudurum dengeleyiciyle birlikteyken risk artışı yok" bulgusunun yalnızca kaba bir temsilidir.
  - İki yeni grup başlığı İngilizce sürüme de eklendi. Lehçe ve Almanca sürümlerde yeni kayıtlar İngilizce görünür.

- **Üç yaşam tarzı kaydı eklendi (24 Kasım 2026, kullanıcı isteği):** yeni grup "Yaşam Tarzı ve Ekran". Hiçbiri özgün çalışmada yoktur. Kanıt ilişki düzeyindedir ve bu, grup başlığının altında ve her kaydın "Uyarlayanın notu" kutusunda yazılıdır.
  - **Egzersiz:** mani çukuru 2,3, depresyon çukuru 1,8. Melo ve ark. 2016, doi:10.1016/j.jad.2016.03.004 (bipolar bozukluğa özgü sistematik derleme; randomize çalışma yok).
  - **Sorunlu oyun oynama:** mani çukuru 2,4, depresyon çukuru 2,6, kaos 0,25. Ostinelli ve ark. 2021, doi:10.1016/j.jad.2021.02.014; Kristensen ve ark. 2021, doi:10.3389/fpsyt.2021.675237; Floros ve Mylona 2023, doi:10.3390/jcm12196251. Mani çukurundaki küçük derinleşme uyku kaybı üzerinden kurulmuş bir çıkarımdır, doğrudan kaynağı yoktur.
  - **Kısa video kaydırma (sorunlu kullanım):** mani çukuru 2,2 (değişmez), depresyon çukuru 2,5, kaos 0,30. Tang ve ark. 2026, doi:10.2196/82503; Conte ve ark. 2025, doi:10.1007/s00787-024-02581-w. Kaynaklar bipolar bozukluğa özgü değildir; olağan kullanımda anlamlı ilişki bulunmamıştır.

## Sınırlılıklar

Eğitim amaçlı bir görselleştirmedir, tıbbi bir araç değildir. Parametreler basitleştirilmiş yaklaşık değerlerdir ve klinik yönlendirme niteliği taşımaz. Metinlerdeki klinik ifadeler özgün çalışmadan çevrilmiştir; güncel kılavuzlar ve Kısa Ürün Bilgisi ile tek tek doğrulanmamıştır.

## Yayın

`main` dalı kaynak kodu, `yayin` dalı `npm run build` çıktısını (statik dosyalar) içerir. miracbarisusta.com `yayin` dalını `/bipolar-manzarasi/` altında yayımlar.
