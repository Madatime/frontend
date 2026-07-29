// Solo sustituye la imagen mostrada en el frontend; no modifica los datos del backend.
const catalogImageData = Object.freeze({
    "Teclado mecánico inalámbrico": ["https://live.staticflickr.com/8670/16085529583_c179e2ef37_b.jpg", "henribergius", "https://www.flickr.com/photos/15087210@N00/16085529583", "CC BY-SA 2.0", "https://creativecommons.org/licenses/by-sa/2.0/"],
    "Cafetera programable de 12 tazas": ["https://live.staticflickr.com/65535/50323030032_3387e51b6a_b.jpg", "coffee-rank", "https://www.flickr.com/photos/189612330@N06/50323030032", "CC BY 2.0", "https://creativecommons.org/licenses/by/2.0/"],
    "Silla ergonómica de oficina": ["https://upload.wikimedia.org/wikipedia/commons/8/8a/Prototype_ergonomic_office_chair%2C_V%26A_London.jpg", "14GTR", "https://commons.wikimedia.org/w/index.php?curid=148626231", "CC0", "https://creativecommons.org/publicdomain/zero/1.0/deed.en/"],
    "Kit de cuidado facial": ["https://live.staticflickr.com/3667/33446442895_2016530efb_b.jpg", "simmons.kevin4208", "https://www.flickr.com/photos/132826082@N06/33446442895", "CC BY 2.0", "https://creativecommons.org/licenses/by/2.0/"],
    "Aspiradora ciclónica sin bolsa": ["https://live.staticflickr.com/2284/1496544344_d9e9804aee_b.jpg", "www.trek.today", "https://www.flickr.com/photos/34107995@N00/1496544344", "CC BY 2.0", "https://creativecommons.org/licenses/by/2.0/"],
    "Lámpara decorativa de mesa": ["https://pd.w.org/2026/06/4496a21204ec73f26.10478845-1536x2048.jpg", "Utsav Singh Rathour", "https://wordpress.org/photos/photo/4496a21204/", "CC0", "https://creativecommons.org/publicdomain/zero/1.0/"],
    "Cuaderno profesional de pasta dura": ["https://live.staticflickr.com/65535/49060351977_2290586f3f.jpg", "shop8447", "https://www.flickr.com/photos/185514373@N06/49060351977", "CC0", "https://creativecommons.org/publicdomain/zero/1.0/"],
    "Set de lápices de colores": ["https://live.staticflickr.com/7411/12258455276_8d7f29981a_b.jpg", "Rene Mensen", "https://www.flickr.com/photos/44206268@N07/12258455276", "CC BY 2.0", "https://creativecommons.org/licenses/by/2.0/"],
    "Monitor LED de 24 pulgadas": ["https://live.staticflickr.com/3293/3126952638_de8f1c04d0_b.jpg", "hodgers", "https://www.flickr.com/photos/35468147887@N01/3126952638", "CC BY-SA 2.0", "https://creativecommons.org/licenses/by-sa/2.0/"],
    "Cámara web Full HD": ["https://live.staticflickr.com/41/92145961_7a34603ed1_b.jpg", "Uwe Hermann", "https://www.flickr.com/photos/73628542@N00/92145961", "CC BY-SA 2.0", "https://creativecommons.org/licenses/by-sa/2.0/"],
    "Tornamesa con conexión Bluetooth": ["https://upload.wikimedia.org/wikipedia/commons/1/1e/Unitra-Fonica_WG-511_Turntable_Record_Player.jpg", "Jrs9550", "https://commons.wikimedia.org/wiki/File:Unitra-Fonica_WG-511_Turntable_Record_Player.jpg", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0/"],
    "Procesador de alimentos compacto": ["https://upload.wikimedia.org/wikipedia/commons/d/d1/Food_Processor_2.jpg", "Donovan Govan", "https://commons.wikimedia.org/wiki/File:Food_Processor_2.jpg", "CC BY-SA 3.0", "https://creativecommons.org/licenses/by-sa/3.0/"],
    "Báscula digital de cocina": ["/product-images/bascula-digital-cocina.png", "", "", "", ""],
    "Escritorio minimalista con cajón": ["https://live.staticflickr.com/8124/8659993849_323950a1af.jpg", "bnpositive", "https://www.flickr.com/photos/74089168@N00/8659993849", "CC BY-SA 2.0", "https://creativecommons.org/licenses/by-sa/2.0/"],
    "Archivador metálico de tres cajones": ["https://live.staticflickr.com/7217/7249752654_4b1e9fdf42_b.jpg", "401(K) 2013", "https://www.flickr.com/photos/68751915@N05/7249752654", "CC BY-SA 2.0", "https://creativecommons.org/licenses/by-sa/2.0/"],
    "Set de bandas elásticas": ["https://live.staticflickr.com/5805/23898625111_6305e291e2_b.jpg", "Christos Pontikis", "https://www.flickr.com/photos/92854661@N07/23898625111", "Dominio público", "https://creativecommons.org/publicdomain/mark/1.0/"],
    "Plancha cerámica para cabello": ["https://upload.wikimedia.org/wikipedia/commons/5/59/Woman_with_hair_straightener.jpg", "Petr Kratochvil", "https://commons.wikimedia.org/w/index.php?curid=21961759", "CC0", "https://creativecommons.org/publicdomain/zero/1.0/deed.en/"],
    "Espejo LED para maquillaje": ["https://live.staticflickr.com/1027/1145196114_2cce836476_b.jpg", "Betsssssy", "https://www.flickr.com/photos/39154240@N00/1145196114", "CC BY 2.0", "https://creativecommons.org/licenses/by/2.0/"],
    "Cepillo facial sónico": ["https://live.staticflickr.com/65535/51872432006_319895db5d_b.jpg", "Relax Photos", "https://www.flickr.com/photos/194961536@N05/51872432006", "CC BY 2.0", "https://creativecommons.org/licenses/by/2.0/"],
    "Consola portátil retro": ["https://live.staticflickr.com/65535/48765818221_dcf1bd6a49_b.jpg", "France1978", "https://www.flickr.com/photos/51764518@N02/48765818221", "CC BY-SA 2.0", "https://creativecommons.org/licenses/by-sa/2.0/"],
    "Cargador inalámbrico 3 en 1": ["/product-images/cargador-inalambrico-3-en-1.png", "", "", "", ""],
    "Lector electrónico de 6 pulgadas": ["https://live.staticflickr.com/2580/4070018828_d3c43fc266.jpg", "goXunuReviews", "https://www.flickr.com/photos/43602175@N06/4070018828", "CC BY 2.0", "https://creativecommons.org/licenses/by/2.0/"],
    "Proyector portátil Full HD": ["https://live.staticflickr.com/3294/3074512904_faf7d59b3e_b.jpg", "fsse8info", "https://www.flickr.com/photos/37031529@N00/3074512904", "CC BY-SA 2.0", "https://creativecommons.org/licenses/by-sa/2.0/"],
    "Robot aspirador inteligente": ["https://live.staticflickr.com/8508/8499549941_717873b9cd_b.jpg", "dvanzuijlekom", "https://www.flickr.com/photos/52365139@N05/8499549941", "CC BY-SA 2.0", "https://creativecommons.org/licenses/by-sa/2.0/"],
    "Purificador de aire con filtro HEPA": ["https://live.staticflickr.com/7016/6471707209_cd8b1489d8_b.jpg", "bfishadow", "https://www.flickr.com/photos/61368956@N00/6471707209", "CC BY 2.0", "https://creativecommons.org/licenses/by/2.0/"],
    "Juego de toallas de algodón": ["https://live.staticflickr.com/4023/4263957082_8df39becf9_b.jpg", "Horia Varlan", "https://www.flickr.com/photos/10361931@N06/4263957082", "CC BY 2.0", "https://creativecommons.org/licenses/by/2.0/"],
    "Organizador modular para clóset": ["https://live.staticflickr.com/3464/3912729475_fb603348df_b.jpg", "silas216", "https://www.flickr.com/photos/63299533@N00/3912729475", "CC BY-SA 2.0", "https://creativecommons.org/licenses/by-sa/2.0/"],
    "Difusor ultrasónico de aromas": ["https://live.staticflickr.com/2648/4128320052_98ee1def20_b.jpg", "hirotomo", "https://www.flickr.com/photos/80438038@N00/4128320052", "CC BY-SA 2.0", "https://creativecommons.org/licenses/by-sa/2.0/"],
    "Marcadores de punta dual 24 colores": ["https://live.staticflickr.com/3322/3211575030_8f56810e92_b.jpg", "qubodup", "https://www.flickr.com/photos/21051491@N02/3211575030", "CC BY 2.0", "https://creativecommons.org/licenses/by/2.0/"],
    "Carpeta organizadora expandible": ["https://images.rawpixel.com/editor_1024/cHJpdmF0ZS9zdGF0aWMvaW1hZ2Uvd2Vic2l0ZS8yMDIyLTA0L2xyL3B4MTMzMzM1MS1pbWFnZS1rd3Z3MnpsZy5qcGc.jpg", "rawpixel", "https://www.rawpixel.com/image/5912303/photo-image-public-domain-office-free", "CC0", "https://creativecommons.org/publicdomain/zero/1.0/"],
    "Pluma estilográfica recargable": ["https://live.staticflickr.com/7201/6943896489_c58e3612ec_b.jpg", "rmhowie", "https://www.flickr.com/photos/44554023@N07/6943896489", "CC BY-SA 2.0", "https://creativecommons.org/licenses/by-sa/2.0/"],
    "Kit de notas adhesivas": ["https://live.staticflickr.com/5018/5723481678_04d9882255_b.jpg", "Rameshng", "https://www.flickr.com/photos/39107352@N08/5723481678", "CC BY-SA 2.0", "https://creativecommons.org/licenses/by-sa/2.0/"],
    "Papel fotográfico brillante 100 hojas": ["https://live.staticflickr.com/7195/6813025492_9285d05f30_b.jpg", "Abaraphobia", "https://www.flickr.com/photos/52585175@N07/6813025492", "CC BY-SA 2.0", "https://creativecommons.org/licenses/by-sa/2.0/"],
    "Unidad SSD externa de 1 TB": ["https://live.staticflickr.com/3778/9527615376_b6d56596cd_b.jpg", "sridgway", "https://www.flickr.com/photos/68132273@N00/9527615376", "CC BY 2.0", "https://creativecommons.org/licenses/by/2.0/"],
    "Hub USB-C 7 en 1": ["https://upload.wikimedia.org/wikipedia/commons/4/46/USB_hub.jpg", "The original uploader was Ds13 at English Wikipedia. Later versions were uploaded by Marcan, Asim18 at en.wikipedia.", "https://commons.wikimedia.org/w/index.php?curid=2773182", "CC BY-SA", "https://creativecommons.org/licenses/by-sa/2.5/"],
    "Soporte de aluminio para laptop": ["https://live.staticflickr.com/2599/3801412611_1165b4ce8b_b.jpg", "mandiberg", "https://www.flickr.com/photos/42586873@N00/3801412611", "CC BY-SA 2.0", "https://creativecommons.org/licenses/by-sa/2.0/"],
    "Router Wi-Fi 6 de doble banda": ["https://live.staticflickr.com/7308/9736658840_61414bc1cb_b.jpg", "Sean MacEntee", "https://www.flickr.com/photos/18090920@N07/9736658840", "CC BY 2.0", "https://creativecommons.org/licenses/by/2.0/"],
    "Impresora multifuncional Wi-Fi": ["https://upload.wikimedia.org/wikipedia/commons/d/df/Multifunction_printer_Brother_DCP-J315W.JPG", "Krzysztof Masloch", "https://commons.wikimedia.org/w/index.php?curid=27903402", "CC BY-SA 3.0", "https://creativecommons.org/licenses/by-sa/3.0/"],
    "Barra de sonido 2.1 canales": ["https://upload.wikimedia.org/wikipedia/commons/8/81/Samsung_TV_UE55F9000_with_Sonos_wireless_speakers_PLAY_5_and_Sonos_soundbar.jpg", "Pittigrilli", "https://commons.wikimedia.org/w/index.php?curid=121337433", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0/"],
    "Audífonos gamer con micrófono": ["https://live.staticflickr.com/1825/29447967578_2d330c6a34.jpg", "nodstrum", "https://www.flickr.com/photos/156259214@N05/29447967578", "CC BY 2.0", "https://creativecommons.org/licenses/by/2.0/"],
    "Reproductor multimedia 4K": ["https://live.staticflickr.com/7535/16007027008_f81818e8a6_b.jpg", "Tolbxela", "https://www.flickr.com/photos/25147647@N04/16007027008", "CC BY 2.0", "https://creativecommons.org/licenses/by/2.0/"],
    "Radio portátil con Bluetooth": ["https://live.staticflickr.com/65535/49040781402_4ff97fe48e_b.jpg", "France1978", "https://www.flickr.com/photos/51764518@N02/49040781402", "CC BY-SA 2.0", "https://creativecommons.org/licenses/by-sa/2.0/"],
    "Soporte articulado para TV": ["https://live.staticflickr.com/7423/11941258744_8bdcc2a0e4_b.jpg", "jalexartis", "https://www.flickr.com/photos/53625232@N00/11941258744", "CC BY 2.0", "https://creativecommons.org/licenses/by/2.0/"],
    "Freidora de aire de 5 litros": ["https://upload.wikimedia.org/wikipedia/commons/0/0c/Air_Fryer_5458.jpg", "Ashley Pomeroy", "https://commons.wikimedia.org/wiki/File:Air_Fryer_5458.jpg", "CC BY 4.0", "https://creativecommons.org/licenses/by/4.0/"],
    "Horno eléctrico de 20 litros": ["https://upload.wikimedia.org/wikipedia/commons/6/68/Zojirushi_toaster_oven_ET-TB15_2.jpg", "DryPot", "https://commons.wikimedia.org/wiki/File:Zojirushi_toaster_oven_ET-TB15_2.jpg", "CC BY-SA 3.0", "https://creativecommons.org/licenses/by-sa/3.0/"],
    "Batería de cocina de 10 piezas": ["https://live.staticflickr.com/2243/13180371865_63821a6002_b.jpg", "fictures", "https://www.flickr.com/photos/53838941@N00/13180371865", "CC BY 2.0", "https://creativecommons.org/licenses/by/2.0/"],
    "Tostador de dos rebanadas": ["https://ids.si.edu/ids/deliveryService?id=NMAH-NMAH2004-06419", "Hoskins Manufacturing Company", "https://n2t.net/ark:/65665/ng49ca746b2-4590-704b-e053-15f76fa0b4fa", "CC0", "https://creativecommons.org/publicdomain/zero/1.0/"],
    "Termo dispensador de 3 litros": ["https://live.staticflickr.com/8395/8679965625_33961a6c48_b.jpg", "gruntzooki", "https://www.flickr.com/photos/37996580417@N01/8679965625", "CC BY-SA 2.0", "https://creativecommons.org/licenses/by-sa/2.0/"],
    "Reposapiés ergonómico ajustable": ["https://upload.wikimedia.org/wikipedia/commons/5/56/Adjustable_wooden_footrest%2C_England%2C_1830-1930_Wellcome_L0057870.jpg", "Wellcome Library", "https://commons.wikimedia.org/wiki/File:Adjustable_wooden_footrest,_England,_1830-1930_Wellcome_L0057870.jpg", "CC BY 4.0", "https://creativecommons.org/licenses/by/4.0/"],
    "Destructora de papel compacta": ["https://live.staticflickr.com/6075/6133267677_ba4a6477ca_b.jpg", "Sh4rp_i", "https://www.flickr.com/photos/85638163@N00/6133267677", "CC BY 2.0", "https://creativecommons.org/licenses/by/2.0/"],
    "Set de organizadores de escritorio": ["https://live.staticflickr.com/8682/29967923790_6fc2bcc24c_b.jpg", "ZERGE_VIOLATOR", "https://www.flickr.com/photos/47257185@N03/29967923790", "CC BY 2.0", "https://creativecommons.org/licenses/by/2.0/"],
    "Mesa plegable para home office": ["https://live.staticflickr.com/8089/8534098951_3141896cab.jpg", "Paris on Ponce & Le Maison Rouge", "https://www.flickr.com/photos/93887713@N00/8534098951", "CC BY 2.0", "https://creativecommons.org/licenses/by/2.0/"],
    "Bicicleta fija magnética": ["https://upload.wikimedia.org/wikipedia/commons/7/77/Stationary_bikes_at_a_gym.jpg", "KeepActive Australia", "https://commons.wikimedia.org/wiki/File:Stationary_bikes_at_a_gym.jpg", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0/"],
    "Cuerda para saltar con contador": ["https://live.staticflickr.com/5280/7190171420_5b956ebd17.jpg", "pernillarydmark", "https://www.flickr.com/photos/63158617@N07/7190171420", "CC BY-SA 2.0", "https://creativecommons.org/licenses/by-sa/2.0/"],
    "Rodillo para masaje muscular": ["https://live.staticflickr.com/6169/6222774519_c08427ec6f_b.jpg", "rachelkramerbussel.com", "https://www.flickr.com/photos/33108296@N07/6222774519", "CC BY 2.0", "https://creativecommons.org/licenses/by/2.0/"],
    "Guantes para entrenamiento": ["/product-images/guantes-entrenamiento.png", "", "", "", ""],
    "Banco ajustable para ejercicio": ["https://live.staticflickr.com/7275/7576698058_7a59c4c875_b.jpg", "Monkey Mash Button", "https://www.flickr.com/photos/62698615@N08/7576698058", "CC BY-SA 2.0", "https://creativecommons.org/licenses/by-sa/2.0/"],
    "Afeitadora eléctrica recargable": ["https://upload.wikimedia.org/wikipedia/commons/5/52/Philips_Norelco_9700_Rotary_Electric_Shaver_%2830973817280%29.jpg", "moo.review", "https://commons.wikimedia.org/w/index.php?curid=55348458", "CC BY 2.0", "https://creativecommons.org/licenses/by/2.0/"],
    "Masajeador facial de cuarzo": ["https://live.staticflickr.com/65535/50556930426_4d9e12c20b_b.jpg", "jacobcariaga", "https://www.flickr.com/photos/190893163@N06/50556930426", "CC BY 2.0", "https://creativecommons.org/licenses/by/2.0/"],
    "Organizador acrílico para cosméticos": ["/product-images/organizador-acrilico-cosmeticos.png", "", "", "", ""],
    "Báscula corporal inteligente": ["https://live.staticflickr.com/2768/4517197776_7768dd63fd.jpg", "-Paul H-", "https://www.flickr.com/photos/8729683@N02/4517197776", "CC BY 2.0", "https://creativecommons.org/licenses/by/2.0/"]
});

export const applyCatalogImageOverride = (producto) => {
    const imageUrl = catalogImageData[producto?.nombre]?.[0];

    return imageUrl
        ? { ...producto, imagenUrl: imageUrl }
        : producto;
};

export const catalogImageCredits = Object.entries(catalogImageData)
    .filter(([, [, , fuente, , licenciaUrl]]) => fuente && licenciaUrl)
    .map(([producto, [, autor, fuente, licencia, licenciaUrl]]) => ({
        producto,
        autor,
        fuente,
        licencia,
        licenciaUrl
    }));
