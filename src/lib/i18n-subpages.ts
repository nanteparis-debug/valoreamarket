// Strongly-typed internationalization dictionaries for all subpages across 8 supported languages

export interface SubpageContent {
  common: {
    backHome: string;
    home: string;
    loading: string;
    error: string;
    usdReference: string;
    verifiedBrokerage: string;
  };
  about: {
    breadcrumb: string;
    badge: string;
    title: string;
    subtitle: string;
    pillar1Title: string;
    pillar1Desc: string;
    pillar2Title: string;
    pillar2Desc: string;
    pillar3Title: string;
    pillar3Desc: string;
    hubsBadge: string;
    hubsTitle: string;
    hubs: Array<{ name: string; role: string; desc: string }>;
    governanceTitle: string;
    governanceDesc: string;
  };
  contact: {
    breadcrumb: string;
    badge: string;
    title: string;
    subtitle: string;
    formTitle: string;
    nameLabel: string;
    namePlaceholder: string;
    companyLabel: string;
    companyPlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    sectorLabel: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitBtn: string;
    submitting: string;
    successTitle: string;
    successDesc: string;
    desksTitle: string;
    desksSubtitle: string;
    desks: Array<{ name: string; role: string; email: string; phone: string; location: string }>;
  };
  faq: {
    breadcrumb: string;
    badge: string;
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allCategories: string;
    categories: Array<{
      category: string;
      questions: Array<{ q: string; a: string }>;
    }>;
    ctaTitle: string;
    ctaDesc: string;
    ctaBtn: string;
  };
  terms: {
    breadcrumb: string;
    badge: string;
    title: string;
    effectiveDate: string;
    sections: Array<{ title: string; content: string }>;
  };
  privacy: {
    breadcrumb: string;
    badge: string;
    title: string;
    effectiveDate: string;
    sections: Array<{ title: string; content: string; list?: string[] }>;
  };
  cookies: {
    breadcrumb: string;
    badge: string;
    title: string;
    updatedDate: string;
    section1Title: string;
    section1Content: string;
    section2Title: string;
    tableHeaders: { name: string; purpose: string; duration: string; category: string };
    tableRows: Array<{ name: string; purpose: string; duration: string; category: string }>;
  };
  ncnda: {
    breadcrumb: string;
    badge: string;
    title: string;
    subtitle: string;
    sections: Array<{ title: string; content: string }>;
  };
  brokerage: {
    breadcrumb: string;
    badge: string;
    title: string;
    subtitle: string;
    sections: Array<{ title: string; notice?: string; content: string; list?: string[] }>;
  };
  catalog: {
    backHome: string;
    topBanner: string;
    badge: string;
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allSectors: string;
    sgsInspected: string;
    benchmarkSpecs: string;
    pricingBasis: string;
    pricingValue: string;
    incoterms: string;
    incotermsValue: string;
    buyRequest: string;
    supplyOffer: string;
    noResults: string;
    resetFilters: string;
    footerText: string;
  };
  auth: {
    backHome: string;
    signInBadge: string;
    signInTitle: string;
    signInSubtitle: string;
    registerBadge: string;
    registerTitle: string;
    registerSubtitle: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    confirmPasswordLabel: string;
    companyLabel: string;
    countryLabel: string;
    fullNameLabel: string;
    mfaTitle: string;
    mfaSubtitle: string;
    mfaCodeLabel: string;
    verifyMfaBtn: string;
    signInBtn: string;
    registerBtn: string;
    passkeyBtn: string;
    forgotPassword: string;
    noAccount: string;
    registerLink: string;
    alreadyAccount: string;
    signInLink: string;
    agreeTerms: string;
    errorRequired: string;
    errorMfa: string;
  };
  broker: {
    breadcrumb: string;
    badge: string;
    title: string;
    subtitle: string;
    refresh: string;
    pendingProp: string;
    pendingSubtitle: string;
    openRooms: string;
    openRoomsSubtitle: string;
    projectedCommissions: string;
    commissionsSubtitle: string;
    complianceLock: string;
    complianceLockSubtitle: string;
    buyer: string;
    supplier: string;
    commodity: string;
    volume: string;
    benchmarkPrice: string;
    commission: string;
    actions: string;
    reviewApprove: string;
    openDealRoom: string;
    reject: string;
  };
  compliance: {
    breadcrumb: string;
    badge: string;
    title: string;
    subtitle: string;
    allScopes: string;
    kybScope: string;
    kycScope: string;
    cargoScope: string;
    sanctionsScope: string;
    approved: string;
    pendingReview: string;
    additionalInfo: string;
    incomplete: string;
    rejected: string;
    expired: string;
    suspended: string;
    company: string;
    scope: string;
    status: string;
    lastUpdated: string;
    actions: string;
    viewDetails: string;
  };
  billing: {
    breadcrumb: string;
    badge: string;
    title: string;
    subtitle: string;
    currentPlan: string;
    monthlyBilling: string;
    annualBilling: string;
    upgradePlan: string;
    invoicesTitle: string;
    downloadPdf: string;
    milestoneNotice: string;
    seats: string;
    renewal: string;
  };
  security: {
    breadcrumb: string;
    badge: string;
    title: string;
    subtitle: string;
    passkeyTitle: string;
    passkeyDesc: string;
    registerPasskey: string;
    activeSessions: string;
    currentSession: string;
    revokeAll: string;
    enrolledKeys: string;
    lastActive: string;
    ipAddress: string;
    browser: string;
  };
}

export const SUBPAGES_DATA: Record<string, SubpageContent> = {
  ar: {
    common: {
      backHome: "العودة إلى الرئيسية",
      home: "الرئيسية",
      loading: "جارٍ التحميل...",
      error: "حدث خطأ غير متوقع",
      usdReference: "مرجع التسعير بالدولار الأمريكي",
      verifiedBrokerage: "وساطة دولية معتمدة"
    },
    about: {
      breadcrumb: "عن المنصة",
      badge: "البنية التحتية المؤسسية لوساطة السلع",
      title: "ربط أسواق السلع العالمية بالثقة والشفافية",
      subtitle: "VALOREA MARKET هي منصة وساطة مؤسسية دولية صُممت لحل فجوات الثقة في التجارة المادية العابرة للحدود عبر التدقيق الصارم والوساطة غير الإيداعية.",
      pillar1Title: "تسوية غير إيداعية (Non-Custodial)",
      pillar1Desc: "لا تحتفظ المنصة بأموال تسوية البضائع المادية إطلاقاً. تتم التسوية مباشرة بين الحسابات المصرفية المعتمدة للمشتري والمورد عبر الاعتمادات المستندية DLC و SBLC.",
      pillar2Title: "تحقق متعدد المراحل (KYC/KYB)",
      pillar2Desc: "يخضع كل كيان تجاري للتحقق من السجل التجاري والمالك النفعي الحقيقي UBO، مع فحص مستمر لقوائم العقوبات الدولية (OFAC, EU, UN, UK).",
      pillar3Title: "غرف صفقات مشفرة E2EE",
      pillar3Desc: "اجتماعات فيديو مشفرة، ومعاينة مستندات تقنية بعلامات مائية ديناميكية، مع رصد آلي يمنع تسريب بيانات الاتصال لضمان حماية أطراف الصفقة.",
      hubsBadge: "شبكة المكاتب الدولية",
      hubsTitle: "مكاتب تشغيلية في أبرز مراكز تجارة السلع",
      hubs: [
        { name: "جنيف، سويسرا", role: "المقر الرئيسي والحوكمة", desc: "شارع الرون 42، 1204 جنيف. الامتثال القانوني والتحكيم الدولي." },
        { name: "دبي، الإمارات", role: "مركز الطاقة والشرق الأوسط", desc: "مركز دبي المالي العالمي (DIFC). النفط الخام والمشتقات والبتروكيماويات." },
        { name: "سنغافورة", role: "مكتب آسيا والمحيط الهادئ", desc: "مارينا باي فاينانشال سنتر. الغاز المسال والمعادن والأسمدة." },
        { name: "هيوستن، الولايات المتحدة", role: "مكتب الأمريكتين", desc: "شارع لويزيانا، هيوستن تكساس. عقود WTI والغاز والمواد الصناعية." }
      ],
      governanceTitle: "الحوكمة والامتثال القانوني",
      governanceDesc: "تلتزم VALOREA MARKET بأعلى المعايير التنظيمية السويسرية والدولية بما يضمن بيئة تداول نظيفة وخالية من المخاطر للشركات الكبرى."
    },
    contact: {
      breadcrumb: "اتصل بنا",
      badge: "دعم مستمر 24/7 لغرف الصفقات والامتثال",
      title: "التواصل مع المكاتب المؤسسية لـ VALOREA MARKET",
      subtitle: "تواصل مع وسطائنا التجاريين ومسؤولي الامتثال القانوني. تتوفر قنوات اتصال مشفرة لهيكلة الصفقات ذات الحساسية العالية.",
      formTitle: "إرسال استفسار تجاري أو طلب انضمام",
      nameLabel: "الاسم الكامل للممثل",
      namePlaceholder: "الاسم الكامل وفق الهوية",
      companyLabel: "اسم الشركة والكيان التجاري",
      companyPlaceholder: "الاسم القانوني للشركة",
      emailLabel: "البريد الإلكتروني للعمل",
      emailPlaceholder: "name@company.com",
      sectorLabel: "قطاع السلع المعني",
      messageLabel: "تفاصيل الطلب أو الاستفسار",
      messagePlaceholder: "يرجى توضيح نوع السلعة والكمية والميناء المطلوب...",
      submitBtn: "إرسال الاستفسار الآن",
      submitting: "جارٍ الإرسال بأمان...",
      successTitle: "تم استلام استفسارك بنجاح",
      successDesc: "سيتواصل معك وسيط معتمد من مكتب الامتثال المختص خلال 4 ساعات عمل.",
      desksTitle: "المكاتب التجارية المعتمدة",
      desksSubtitle: "قنوات الاتصال المباشرة بالمكاتب الإقليمية",
      desks: [
        { name: "مكتب جنيف (المقر الرئيسي)", role: "الامتثال والحوكمة", email: "geneva.desk@valoreamarket.com", phone: "+41 22 819 9200", location: "Rue du Rhône 42, 1204 Genève" },
        { name: "مكتب دبي (الشرق الأوسط)", role: "وساطة الطاقة والوقود", email: "dubai.desk@valoreamarket.com", phone: "+971 4 362 7500", location: "DIFC Gate Precinct 4, Dubai" },
        { name: "مكتب سنغافورة (آسيا)", role: "المعادن والغاز الطبيعي", email: "singapore.desk@valoreamarket.com", phone: "+65 6818 6000", location: "Marina Bay Financial Centre, Tower 2" },
        { name: "مكتب هيوستن (الأمريكتان)", role: "النفط الخام والمكثفات", email: "houston.desk@valoreamarket.com", phone: "+1 713 546 8000", location: "1000 Louisiana St, Houston, TX" }
      ]
    },
    faq: {
      breadcrumb: "الأسئلة الشائعة",
      badge: "دليل الامتثال وآليات التداول",
      title: "الأسئلة الشائعة حول منصة VALOREA MARKET",
      subtitle: "إجابات شاملة ومفصلة حول آليات الوساطة، والتحقق المؤسسي، وتسوية البضائع، وحماية الوثائق.",
      searchPlaceholder: "ابحث في الأسئلة الشائعة...",
      allCategories: "جميع الأقسام",
      categories: [
        {
          category: "التحقق والامتثال (KYC/KYB)",
          questions: [
            {
              q: "ما هي شروط التحقق المطلوبة للتداول عبر المنصة؟",
              a: "يتطلب التداول تحققاً ثلاثي المراحل: (1) التحقق من الكيان التجاري KYB وسجل المالك النفعي الحقيقي UBO؛ (2) التحقق من هوية الممثل القانوني وتفويضه الرسمي؛ (3) فحص آلي فوري ضد قوائم العقوبات الدولية (OFAC, EU, UN, UK)."
            },
            {
              q: "كيف يتم التحقق من ملكية الشحنة وحقوق التوريد؟",
              a: "يجب على الموردين تقديم وثائق رسمية قابلة للمصادقة مثل خطابات تخصيص المصافي، أو إيصالات تخزين الخزانات المعتمدة (TSR)، أو بوالص الشحن، ويتم تدقيقها بواسطة مسؤولي الامتثال قبل فتح غرف الصفقات."
            },
            {
              q: "ماذا يعني قفل الامتثال (Compliance Lock)؟",
              a: "في حال كانت حالة الشركة قيد المراجعة أو معلقة، تُحظر المشاركة في غرف الصفقات وتقديم العروض تلقائياً حتى استكمال الوثائق المطلوبة."
            }
          ]
        },
        {
          category: "التسوية والقنوات المصرفية",
          questions: [
            {
              q: "هل تحتفظ VALOREA MARKET بأموال تسوية الشحنات؟",
              a: "كلا، إطلاقاً. VALOREA MARKET منصة وساطة غير إيداعية (Non-Custodial). تتم تسوية مبالغ الشحنات مباشرة بين البنوك التجارية للمشتري والمورد باستخدام الاعتمادات المستندية (DLC / SBLC) أو التحويل المباشر (TT)."
            },
            {
              q: "لماذا يُعتمد الدولار الأمريكي كعملة مرجعية للتسعير؟",
              a: "تُقوّم أسواق السلع المادية العالمية (النفط، الغاز، المعادن، الأسمدة) قياسياً بالدولار الأمريكي. تُظهر المنصة القيم المعادلة بالدولار لضمان المقارنة الدقيقة والعادلة للصفقات الدولية."
            }
          ]
        },
        {
          category: "غرف الصفقات وحماية الوثائق",
          questions: [
            {
              q: "لماذا تقوم غرف الصفقات باعتراض أرقام الهواتف والبريد؟",
              a: "لحماية حقوق أطراف الصفقة وتطبيق اتفاقية عدم الالتفاف (NCNDA)، يتم فحص الرسائل آلياً لمنع تسريب بيانات الاتصال الخارجية خارج إشراف الوسيط المعتمد."
            },
            {
              q: "هل يستطيع الطرف الآخر تنزيل وثائقي الأصلية؟",
              a: "لا يمكن تنزيل الوثائق الأصلية إلا بموافقة صريحة من مالك الوثيقة. يقتصر الوصول الأولي على معاينات منقحة ومحمية بعلامات مائية تتضمن هوية المشاهد وتاريخ الجلسة."
            }
          ]
        },
        {
          category: "الاتفاقيات القانونية والعمولات",
          questions: [
            {
              q: "ما هي اتفاقية منع الالتفاف وعدم الإفشاء (NCNDA) المعتمدة؟",
              a: "تعتمد المنصة النموذج القياسي الدولي 769 الصادر عن غرفة التجارة الدولية (ICC)، وهو ملزم قانونياً لمدة خمس سنوات من تاريخ التعريف بالصفقة."
            },
            {
              q: "متى تستحق عمولة الوساطة؟",
              a: "تستحق عمولة الوساطة عند تحقيق المعالم التعاقدية (مثل تفعيل الاعتماد المستندي LC، أو صدور تقرير فحص SGS، أو إصدار بوليصة الشحن)، وتصدر فاتورة ضريبية رسمية سويسرية تُسدد خلال 15 يوم عمل مصرفي."
            }
          ]
        }
      ],
      ctaTitle: "هل لديك استفسار محدد حول صفقة معينة؟",
      ctaDesc: "فريق الوسطاء ومسؤولو الامتثال جاهزون لمساعدتك والإجابة على متطلباتك التجارية.",
      ctaBtn: "تواصل مع مكتب الوساطة"
    },
    terms: {
      breadcrumb: "شروط الخدمة",
      badge: "عقد مؤسسي ملزم للتجارة بين الشركات (B2B)",
      title: "شروط خدمة منصة VALOREA MARKET",
      effectiveDate: "تاريخ السريان: 13 نوفمبر 2026 • الاختصاص القضائي: جنيف، سويسرا",
      sections: [
        {
          title: "1. طبيعة المنصة ونطاق عملها",
          content: "تدير VALOREA MARKET International AG (المشار إليها بـ 'VALOREA MARKET') منصة وساطة إلكترونية مؤسسية متخصصة وغير إيداعية تربط بين الكيانات المعتمدة (المشترين والموردين) لمعاملات السلع المادية. تعمل VALOREA MARKET كوسيط ومُشرف مستقل على الصفقات."
        },
        {
          title: "2. سياسة عدم الإيداع وتسوية البضائع المادية",
          content: "لا تستلم VALOREA MARKET ولا تحتفظ ولا تحوّل أموال الشراء الخاصة بالسلع المادية. تتم تسوية جميع المدفوعات الناتجة عن عقود السلع مباشرة بين الحسابات المصرفية المعتمدة للمشتري والمورد من خلال الاعتمادات المستندية القابلة للتحقق (DLC / SBLC) أو الضمانات المصرفية."
        },
        {
          title: "3. متطلبات التحقق وقوائم العقوبات",
          content: "يُشترط للدخول إلى غرف الصفقات واستعراض العروض الحفاظ على حالة 'معتمد' في سجل الامتثال. يتم تعليق أي كيان يقع تحت طائلة العقوبات الدولية (OFAC, EU, UN, UK) أو يفشل في إثبات سجل المالك النفعي الحقيقي UBO فوراً وبشكل تلقائي."
        },
        {
          title: "4. حظر الالتفاف وحماية الوساطة (ICC 769)",
          content: "يلتزم جميع الأعضاء بنموذج اتفاقية منع الالتفاف وعدم الإفشاء القياسي الصادر عن غرفة التجارة الدولية (ICC 769). أي تجاوز للمنصة أو تعاقد مباشر خارج إشراف الوسيط المعتمد مع أطراف تم التعريف بها عبر المنصة يُعد خرقاً جوهرياً يُلزم الطرف المخالف بدفع تعويضات اتفاقية تعادل ثلاثة أضعاف (3x) عمولة الوساطة الإجمالية المتوقعة، بالإضافة إلى مصاريف التحكيم وأتعاب المحاماة."
        },
        {
          title: "5. القانون الواجب التطبيق والتحكيم الدولي",
          content: "تخضع هذه الشروط وتُفسر وفقاً للقوانين الموضوعية لدولة سويسرا. يتم فض أي نزاع ينشأ عن هذه الاتفاقية حصرياً عن طريق التحكيم أمام مركز التحكيم السويسري (Swiss Arbitration Centre) في جنيف."
        }
      ]
    },
    privacy: {
      breadcrumb: "سياسة الخصوصية",
      badge: "مطابقة تامة للائحة الأوروبية GDPR وقانون حماية البيانات السويسري FADP",
      title: "سياسة الخصوصية وحماية البيانات التجارية",
      effectiveDate: "تاريخ السريان: 13 نوفمبر 2026 • المسؤول عن البيانات: VALOREA MARKET International AG، جنيف",
      sections: [
        {
          title: "1. نظرة عامة والالتزام بالحماية",
          content: "تلتزم VALOREA MARKET International AG بحماية البيانات التجارية والشخصية وفقاً للائحة العامة لحماية البيانات في الاتحاد الأوروبي (GDPR) والقانون الاتحادي السويسري المراجع لحماية البيانات (FADP)."
        },
        {
          title: "2. فئات البيانات التي تتم معالجتها",
          content: "تشمل البيانات التي نعالجها حصرياً متطلبات التحقق القانوني والتجاري:",
          list: [
            "مستخرجات السجل التجاري وعقود التأسيس وبيانات التسجيل الضريبي.",
            "وثائق إثبات هوية الممثلين المعتمدين وجوازات السفر والتحقق البيومتري.",
            "سجلات فحص قوائم العقوبات والأشخاص المعرضين سياسياً (PEP).",
            "شهادات التحليل المخبري (COA) وبوالص الشحن وتقارير الفحص الفني (SGS).",
            "سجلات تدقيق الأمان وعناوين IP ورموز الجلسات المشفرة ومفاتيح المرور."
          ]
        },
        {
          title: "3. الحماية التشفيرية للوثائق الفنية",
          content: "تُشفر جميع وثائق التداول المرفوعة على المنصة أثناء التخزين بتقنية AES-256-GCM وأثناء النقل ببروتوكول TLS 1.3. لا يتم الكشف عن الوثائق الأصلية غير المنقحة لأي طرف إلا بموافقة صريحة وقابلة للإلغاء من مالك الوثيقة."
        },
        {
          title: "4. مدة الاحتفاظ بالبيانات ومكان الاستضافة",
          content: "تُحفظ سجلات التداول وسجلات التدقيق في مراكز بيانات سويسرية فائقة الأمان لمدة عشر (10) سنوات امتثالاً لمتطلبات قانون التجارة السويسري، ولا تُباع أو تُشارك مع أي أطراف إعلانية."
        }
      ]
    },
    cookies: {
      breadcrumb: "ملفات الارتباط",
      badge: "خالية تماماً من أدوات التتبع الإعلاني",
      title: "سياسة ملفات الارتباط وتخزين الجلسات",
      updatedDate: "آخر تحديث: 13 نوفمبر 2026",
      section1Title: "1. مبدأ الشفافية والضرورة التقنية",
      section1Content: "تحترم VALOREA MARKET الخصوصية المؤسسية. نستخدم حصرياً ملفات الارتباط الضرورية لتشغيل جلسات المستخدم المشفرة وحفظ اللغة المختارة، ولا نستخدم أي أدوات تتبع سلوكية أو إعلانية تابعة لجهات خارجية.",
      section2Title: "2. ملفات الارتباط المستخدمة في المنصة",
      tableHeaders: { name: "اسم الملف", purpose: "الغرض الوظيفي", duration: "مدة الصلاحية", category: "التصنيف" },
      tableRows: [
        { name: "NEXT_LOCALE", purpose: "حفظ اللغة المفضلة للمستخدم (8 لغات مدعومة)", duration: "سنة واحدة", category: "ضروري للغاية" },
        { name: "valorea_session_token", purpose: "رمز جلسة المصادقة المشفر JWT ومفاتيح Passkey", duration: "24 ساعة / انتهاء الجلسة", category: "ضروري للغاية" }
      ]
    },
    ncnda: {
      breadcrumb: "اتفاقية NCNDA",
      badge: "النموذج القياسي الدولي 769 لغرفة التجارة الدولية (ICC)",
      title: "اتفاقية منع الالتفاف وعدم الإفشاء والعمل المشترك",
      subtitle: "توقيع إلكتروني ملزم قانونياً مطلوب قبل الوصول إلى وثائق غرف الصفقات",
      sections: [
        {
          title: "1. تعهدات منع الالتفاف وحماية التعامل",
          content: "يتعهد أطراف الصفقة بعدم الالتفاف أو تجاوز منصة VALOREA MARKET أو الأطراف المشاركة، بشكل مباشر أو غير مباشر، في أي صفقات أو مصادر أو علاقات توريد تم التعرف عليها عبر المنصة. يسري هذا الالتزام لمدة خمس (5) سنوات كاملة من تاريخ التعارف الأولي."
        },
        {
          title: "2. سرية المواصفات والأسعار والمستندات الفنية",
          content: "تُعد جميع الوثائق الفنية وعروض التوريد وشهادات التحليل ومستويات الأسعار المتبادلة في غرف الصفقات معلومات سرية للغاية، ولا يجوز نسخها أو نشرها أو الإفصاح عنها لأي طرف ثالث دون إذن خطي مسبق."
        },
        {
          title: "3. التعويضات الاتفاقية وإنفاذ الحقوق",
          content: "في حال حدوث التفاف متعمد أو تعاقد مباشر خارج المنصة بين أطراف تم التعريف بينهم عبر VALOREA MARKET، يلتزم الطرف المخالف بدفع تعويض اتفاقي يعادل ثلاثة أضعاف (3x) عمولة الوساطة الإجمالية المتوقعة، بالإضافة إلى مصاريف التحكيم وأتعاب المحاماة."
        }
      ]
    },
    brokerage: {
      breadcrumb: "سياسة الوساطة",
      badge: "سياسة التسعير المرجعي بالدولار الأمريكي",
      title: "قواعد تفويض الوساطة وتسوية الشحنات",
      subtitle: "هيكل العمولات المؤسسي، والفوترة المرحلية، وقنوات التسوية المصرفية غير الإيداعية",
      sections: [
        {
          title: "1. تسوية الشحنات المادية غير الإيداعية",
          notice: "تنبيه هام: VALOREA MARKET وسيط تقني وتنظيمي ولا يستقبل أو يحتفظ بأموال شراء البضائع المادية إطلاقاً.",
          content: "تتم تسوية الشحنات المادية (النفط، الوقود، الأسمدة، المعادن، السكر) حصرياً بين الحسابات المصرفية المعتمدة للمشتري والمورد من خلال اعتمادات مستندية معززة وغير قابلة للإلغاء (DLC / SBLC) أو ضمانات مصرفية مطابقة لأعراف UCP 600."
        },
        {
          title: "2. هيكل عمولات الوساطة القياسي",
          content: "تتقاضى VALOREA MARKET عمولة وساطة مؤسسية تتراوح بين 0.50% و 1.50% بحسب حجم الصفقة وتكرار الشحنات، مقوّمة بالدولار الأمريكي، مقابل خدمات المطابقة الذكية والتدقيق الرقابي وإشراف غرف الصفقات.",
          list: [
            "تُحسب العمولات قياسياً بالدولار الأمريكي بغض النظر عن عملة العقد المحلية.",
            "يتم تحديد الطرف الملتزم بالدفع (المشتري، المورد، أو مناصفة) في اتفاقية الوساطة المبرمة لكل صفقة."
          ]
        },
        {
          title: "3. الفوترة المرحلية وشروط الاستحقاق",
          content: "تستحق عمولة الوساطة عند اكتمال المراحل التعاقدية المحددة (مثل تأكيد سريان الاعتماد المستندي، أو صدور تقرير SGS، أو إصدار بوليصة الشحن Clean on Board)، وتصدر فاتورة ضريبية رسمية سويسرية واجبة السداد خلال 15 يوم عمل مصرفي."
        }
      ]
    },
    catalog: {
      backHome: "العودة للرئيسية",
      topBanner: "كتالوج السلع الدولية المعتمدة من VALOREA MARKET (7 قطاعات)",
      badge: "المواصفات القياسية للتجارة الدولية",
      title: "كتالوج السلع والمواصفات القياسية",
      subtitle: "استكشف الدرجات الموحدة، ومعايير الجودة، وشروط التسليم الدولية عبر 7 قطاعات رئيسية.",
      searchPlaceholder: "ابحث بالاسم أو المواصفات (مثل: برنت، ديزل EN590، يوريا، نحاس، سكر)...",
      allSectors: "جميع القطاعات",
      sgsInspected: "مطابق لفحص SGS",
      benchmarkSpecs: "المواصفات المرجعية القياسية:",
      pricingBasis: "أساس التسعير:",
      pricingValue: "دولار أمريكي / طن متري",
      incoterms: "شروط التسليم:",
      incotermsValue: "FOB / CIF / CFR (Incoterms 2020)",
      buyRequest: "تقديم طلب شراء",
      supplyOffer: "تقديم عرض توريد",
      noResults: "لم يتم العثور على سلع تطابق بحثك",
      resetFilters: "إعادة ضبط الفلاتر",
      footerText: "بورصة السلع العالمية VALOREA MARKET • التسعير المرجعي بالدولار الأمريكي"
    },
    auth: {
      backHome: "العودة للرئيسية",
      signInBadge: "بوابة الشركات المعتمدة",
      signInTitle: "تسجيل الدخول إلى VALOREA MARKET",
      signInSubtitle: "الوصول المشفر لغرف الصفقات ولوحة تحكم الوساطة والامتثال",
      registerBadge: "تسجيل حساب مؤسسي جديد",
      registerTitle: "إنشاء حساب شركة في VALOREA MARKET",
      registerSubtitle: "ابدأ عملية التحقق المؤسسي والتداول في أسواق السلع المادية",
      emailLabel: "البريد الإلكتروني للعمل",
      emailPlaceholder: "name@company.com",
      passwordLabel: "كلمة المرور",
      passwordPlaceholder: "••••••••••••",
      confirmPasswordLabel: "تأكيد كلمة المرور",
      companyLabel: "الاسم القانوني للشركة",
      countryLabel: "دولة التأسيس / التسجيل",
      fullNameLabel: "الاسم الكامل للممثل المعتمد",
      mfaTitle: "المصادقة الثنائية (MFA)",
      mfaSubtitle: "أدخل رمز التحقق المكوّن من 6 أرقام من تطبيق المصادقة الخاص بك",
      mfaCodeLabel: "رمز التحقق المكوّن من 6 أرقام",
      verifyMfaBtn: "تأكيد والوصول إلى المنصة",
      signInBtn: "تسجيل الدخول",
      registerBtn: "إرسال طلب التسجيل",
      passkeyBtn: "تسجيل الدخول بمفتاح المرور (FIDO2 Passkey)",
      forgotPassword: "نسيت كلمة المرور؟",
      noAccount: "ليس لديك حساب معتمد؟",
      registerLink: "سجّل شركتك الآن",
      alreadyAccount: "لديك حساب بالفعل؟",
      signInLink: "تسجيل الدخول هنا",
      agreeTerms: "أوافق على شروط الخدمة واتفاقية NCNDA وسياسة الخصوصية",
      errorRequired: "يرجى تعبئة جميع الحقول المطلوبة",
      errorMfa: "يرجى إدخال رمز تحقق صحيح مكوّن من 6 أرقام"
    },
    broker: {
      breadcrumb: "إدارة الوساطة",
      badge: "إشراف الوسيط نشط",
      title: "مركز قيادة الوسيط VALOREA MARKET",
      subtitle: "المطابقة الذكية لصفقات السلع، الإشراف على المفاوضات، قفل الامتثال، وإدارة العمولات.",
      refresh: "تحديث الصفقات",
      pendingProp: "عروض التداول قيد المراجعة",
      pendingSubtitle: "بانتظار مراجعة الوسيط",
      openRooms: "غرف الصفقات المفتوحة",
      openRoomsSubtitle: "المفاوضات بإشراف وسيط جارية",
      projectedCommissions: "العمولات المتوقعة (USD)",
      commissionsSubtitle: "مرتبطة بمراحل العقد",
      complianceLock: "قفل الامتثال الصارم",
      complianceLockSubtitle: "الصفقات غير المعتمدة محظورة",
      buyer: "المشتري",
      supplier: "المورد",
      commodity: "السلعة",
      volume: "الكمية",
      benchmarkPrice: "السعر المرجعي",
      commission: "عمولة الوسيط",
      actions: "الإجراءات",
      reviewApprove: "مراجعة واعتماد",
      openDealRoom: "دخول غرفة الصفقة",
      reject: "رفض"
    },
    compliance: {
      breadcrumb: "بوابة الامتثال",
      badge: "العناية الواجبة المؤسسية",
      title: "سجل الامتثال والتحقق المؤسسي",
      subtitle: "التحقق المؤسسي KYB، والتحقق من الممثل KYC، وفحص قوائم العقوبات الدولية في الوقت الفعلي.",
      allScopes: "جميع النطاقات",
      kybScope: "السجل التجاري (KYB)",
      kycScope: "الممثل المعتمد (KYC)",
      cargoScope: "إثبات حقوق الشحنة",
      sanctionsScope: "العقوبات والأشخاص المعرضين سياسياً",
      approved: "معتمد",
      pendingReview: "قيد المراجعة",
      additionalInfo: "معلومات إضافية مطلوبة",
      incomplete: "غير مكتمل",
      rejected: "مرفوض",
      expired: "منتهي الصلاحية",
      suspended: "معلّق",
      company: "الشركة",
      scope: "النطاق",
      status: "الحالة",
      lastUpdated: "آخر تحديث",
      actions: "الإجراءات",
      viewDetails: "عرض التفاصيل"
    },
    billing: {
      breadcrumb: "الاشتراكات والفوترة",
      badge: "الفوترة والتسوية بالدولار الأمريكي",
      title: "الاشتراكات وفواتير الوساطة",
      subtitle: "اشتراكات الشركات بالدولار الأمريكي وفواتير عمولات الوساطة المعتمدة.",
      currentPlan: "الخطة الحالية النشطة",
      monthlyBilling: "فوترة شهرية",
      annualBilling: "فوترة سنوية (وفّر 20%)",
      upgradePlan: "ترقية الاشتراك",
      invoicesTitle: "الفواتير الضريبية الرسمية",
      downloadPdf: "تحميل الفاتورة السويسرية PDF",
      milestoneNotice: "تستحق فواتير عمولة الوساطة عند اكتمال المراحل التعاقدية المعتمدة.",
      seats: "المقاعد",
      renewal: "تاريخ التجديد"
    },
    security: {
      breadcrumb: "الأمان والجلسات",
      badge: "محصّن وفق معايير OWASP ASVS المستوى 2",
      title: "إدارة الأمان والجلسات المشفرة",
      subtitle: "مفاتيح المرور FIDO2 WebAuthn، وإدارة الجلسات المشفرة، وسجل تدقيق الوصول.",
      passkeyTitle: "مفاتيح الأجهزة FIDO2 WebAuthn",
      passkeyDesc: "مصادقة بيومترية أو بمفتاح أمان مقاومة للتصيد للدخول إلى غرف الصفقات.",
      registerPasskey: "تسجيل مفتاح مرور جديد",
      activeSessions: "الجلسات النشطة المعتمدة",
      currentSession: "هذا الجهاز",
      revokeAll: "إنهاء جميع الجلسات الأخرى",
      enrolledKeys: "المفاتيح المسجلة:",
      lastActive: "آخر نشاط",
      ipAddress: "عنوان IP",
      browser: "المتصفح"
    }
  },
  en: {
    common: {
      backHome: "Back to Home",
      home: "Home",
      loading: "Loading...",
      error: "An unexpected error occurred",
      usdReference: "USD Benchmark Reference",
      verifiedBrokerage: "Verified International Brokerage"
    },
    about: {
      breadcrumb: "About Us",
      badge: "Institutional Commodities Infrastructure",
      title: "Bridging Global Commodity Markets with Verified Trust",
      subtitle: "VALOREA MARKET (Global Verified Commodities Exchange) is an international institutional brokerage platform designed to resolve trust deficits in cross-border physical trading through rigorous verification and non-custodial execution.",
      pillar1Title: "Non-Custodial Settlement",
      pillar1Desc: "VALOREA MARKET never holds physical cargo funds. Settlement takes place strictly through verified commercial banking channels (LC, SBLC, TT) between principals.",
      pillar2Title: "Multi-Stage Verification",
      pillar2Desc: "Every entity undergoes KYB registry authentication, representative KYC, and real-time screening against OFAC, EU, UN, and UK sanctions lists.",
      pillar3Title: "Cryptographic Deal Rooms",
      pillar3Desc: "End-to-end encrypted video meetings, dynamically watermarked technical document inspection, and active contact-leak interception protect transaction integrity.",
      hubsBadge: "Global Desk Network",
      hubsTitle: "Operating in Primary Commodity Trading Hubs",
      hubs: [
        { name: "Geneva, Switzerland", role: "Global Corporate HQ", desc: "Rue du Rhône 42, 1204 Geneva. Compliance, Governance & International Arbitration." },
        { name: "Dubai, UAE", role: "Middle East & Energy Hub", desc: "DIFC Gate Precinct 4. Crude Oil, Refined Petroleum & Petrochemicals Desk." },
        { name: "Singapore", role: "Asia-Pacific Regional Desk", desc: "Marina Bay Financial Centre, Tower 2. LNG, Industrial Metals & Fertilizers." },
        { name: "Houston, USA", role: "Americas Operations", desc: "1000 Louisiana St, Houston, TX. WTI Contracts, Natural Gas & Petrochemicals." }
      ],
      governanceTitle: "Governance & Swiss Regulatory Adherence",
      governanceDesc: "VALOREA MARKET operates under Swiss commercial law and international trade guidelines, maintaining institutional risk isolation for multinational corporations."
    },
    contact: {
      breadcrumb: "Contact Us",
      badge: "24/7 Global Trading & Compliance Support",
      title: "Contact VALOREA MARKET Institutional Desks",
      subtitle: "Reach out to our global trade intermediaries, legal counsel, or compliance officers. Encrypted channels are available for high-confidentiality deal structuring.",
      formTitle: "Submit Trade Inquiry or Onboarding Request",
      nameLabel: "Representative Full Name",
      namePlaceholder: "As shown on government ID",
      companyLabel: "Registered Enterprise Name",
      companyPlaceholder: "Official legal entity name",
      emailLabel: "Corporate Email Address",
      emailPlaceholder: "name@company.com",
      sectorLabel: "Commodity Sector",
      messageLabel: "Inquiry or Trade Specifications",
      messagePlaceholder: "Specify commodity, grade, volume, destination port, and delivery schedule...",
      submitBtn: "Submit Inquiry Now",
      submitting: "Submitting Securely...",
      successTitle: "Inquiry Received Successfully",
      successDesc: "A certified broker and compliance officer from the relevant desk will respond within 4 business hours.",
      desksTitle: "Accredited Global Desks",
      desksSubtitle: "Direct communication channels to regional hubs",
      desks: [
        { name: "Geneva Headquarters", role: "Compliance & Governance", email: "geneva.desk@valoreamarket.com", phone: "+41 22 819 9200", location: "Rue du Rhône 42, 1204 Genève" },
        { name: "Dubai Regional Desk", role: "Crude & Refined Fuels", email: "dubai.desk@valoreamarket.com", phone: "+971 4 362 7500", location: "DIFC Gate Precinct 4, Dubai" },
        { name: "Singapore Regional Desk", role: "Metals & Natural Gas", email: "singapore.desk@valoreamarket.com", phone: "+65 6818 6000", location: "Marina Bay Financial Centre, Tower 2" },
        { name: "Houston Regional Desk", role: "Crude & Condensates", email: "houston.desk@valoreamarket.com", phone: "+1 713 546 8000", location: "1000 Louisiana St, Houston, TX" }
      ]
    },
    faq: {
      breadcrumb: "FAQ",
      badge: "Compliance Guide & Trading Protocols",
      title: "Frequently Asked Questions",
      subtitle: "Detailed answers regarding brokerage execution, enterprise verification, cargo settlement, and document protection.",
      searchPlaceholder: "Search questions and answers...",
      allCategories: "All Categories",
      categories: [
        {
          category: "Verification & Compliance (KYC/KYB)",
          questions: [
            {
              q: "What verification is required to participate in VALOREA MARKET?",
              a: "Participation requires a 3-tier verification: (1) Corporate entity KYB verification validating registration and Ultimate Beneficial Ownership (UBO); (2) Authorized representative KYC validating identity and Power of Attorney; and (3) Automated continuous sanctions screening against OFAC, EU, UN, and UK consolidated lists."
            },
            {
              q: "How does VALOREA MARKET verify cargo title for suppliers?",
              a: "Suppliers must submit verifiable documentation of supply rights, such as refinery allocation contracts, terminal tank storage receipts (TSR), or bills of lading. These are verified by VALOREA MARKET compliance officers prior to deal room activation."
            },
            {
              q: "What happens if a company's compliance status is 'Pending' or 'Suspended'?",
              a: "Under the platform's strict Compliance Lock, entities with pending or suspended compliance cannot be matched and cannot enter active deal rooms. All deal proposals are automatically halted until compliance is re-certified."
            }
          ]
        },
        {
          category: "Settlement & Banking Channels",
          questions: [
            {
              q: "Does VALOREA MARKET hold or escrow physical cargo funds?",
              a: "No. VALOREA MARKET is strictly a non-custodial brokerage platform. The settlement of cargo value takes place directly between the buyer's bank and the seller's bank using conventional commercial instruments like Documentary Letters of Credit (LC), Standby Letters of Credit (SBLC), or Telegraphic Transfers (TT)."
            },
            {
              q: "Why is the US Dollar (USD) used as the platform reference currency?",
              a: "International physical commodities (petroleum, metals, fertilizers, sugar) are benchmarked globally in US Dollars. While parties may express contracts in EUR, AED, or other currencies, VALOREA MARKET displays USD equivalents to ensure transparent, normalized comparisons across international offers."
            }
          ]
        },
        {
          category: "Deal Rooms & Document Security",
          questions: [
            {
              q: "Why does the deal room chat intercept contact details?",
              a: "To protect the integrity of the brokerage mandate and enforce the ICC 769 Non-Circumvention agreement signed by all participants, messages containing external phone numbers, personal emails, or messenger handles are sanitized and reviewed before delivery."
            },
            {
              q: "Can other participants download my original technical documents?",
              a: "No participant can download original unredacted documents without explicit authorization from the document owner organization. Other participants can only inspect dynamically watermarked previews containing session timestamps and user identifiers."
            }
          ]
        },
        {
          category: "Legal & Non-Circumvention (NCNDA)",
          questions: [
            {
              q: "What NCNDA agreement governs the platform?",
              a: "The platform incorporates the International Chamber of Commerce (ICC) Model 769 Non-Circumvention & Non-Disclosure Agreement, which is legally binding for five years from introduction."
            },
            {
              q: "When does the brokerage commission mature?",
              a: "Brokerage fees mature upon verified contractual milestones (e.g. Letter of Credit operative confirmation, SGS inspection release, or Bill of Lading issuance). VALOREA MARKET issues a formal Swiss VAT-compliant tax invoice payable within 15 banking days."
            }
          ]
        }
      ],
      ctaTitle: "Have a specific question regarding a deal structure?",
      ctaDesc: "Our broker team and compliance officers are available to assist with institutional trading requirements.",
      ctaBtn: "Contact Broker Desk"
    },
    terms: {
      breadcrumb: "Terms of Service",
      badge: "Institutional B2B Contract",
      title: "Platform Terms of Service",
      effectiveDate: "Effective Date: November 13, 2026 • Jurisdiction: Geneva, Switzerland",
      sections: [
        {
          title: "1. Platform Nature & Scope",
          content: "VALOREA MARKET International AG (hereinafter 'VALOREA MARKET') operates a specialized, non-custodial electronic trade brokerage platform connecting verified corporate entities ('Buyers' and 'Suppliers') for transactions in physical commodities. VALOREA MARKET acts solely as an independent transaction broker and supervisor."
        },
        {
          title: "2. Non-Custodial Policy & Settlement of Cargo",
          content: "VALOREA MARKET does not hold, clear, or transmit funds for the purchase price of physical commodities. All payments for commodities shall be settled directly between the commercial banking institutions of the Buyer and Supplier through Documentary Letters of Credit (LC), Standby Letters of Credit (SBLC), or Telegraphic Transfer (TT) as agreed between the trading principals."
        },
        {
          title: "3. Verification & Compliance Requirements",
          content: "Access to deal rooms, order matching, and document exchange is contingent upon maintaining an active 'Approved' status in the VALOREA MARKET Compliance Registry. Any entity subject to international sanctions (including OFAC, EU, UN, or UK sanctions regimes) or failing to submit verifiable Ultimate Beneficial Ownership (UBO) records shall be suspended immediately."
        },
        {
          title: "4. Anti-Circumvention and Non-Disclosure (ICC 769)",
          content: "All registered entities are bound by the ICC 769 Non-Circumvention, Non-Disclosure & Working Agreement incorporated herein. Bypassing the platform or directly contracting with matched counterparties outside supervised VALOREA MARKET channels constitutes a material breach entitling VALOREA MARKET to liquidated damages equal to three times (3x) the total anticipated brokerage commission of the transaction, plus all arbitration and legal fees incurred in enforcement."
        },
        {
          title: "5. Governing Law and Arbitration",
          content: "These Terms shall be governed by and construed in accordance with the substantive laws of Switzerland, without regard to its conflict of laws principles. Any dispute arising out of or in connection with this agreement shall be submitted to the exclusive jurisdiction of the Swiss Arbitration Centre in Geneva."
        }
      ]
    },
    privacy: {
      breadcrumb: "Privacy Policy",
      badge: "GDPR & Swiss FADP Compliant",
      title: "Privacy & Data Protection Policy",
      effectiveDate: "Effective Date: November 13, 2026 • Data Controller: VALOREA MARKET International AG, Geneva",
      sections: [
        {
          title: "1. Overview & Commitment",
          content: "VALOREA MARKET International AG is dedicated to safeguarding commercial and personal data. We comply with the European Union General Data Protection Regulation (GDPR) and the revised Swiss Federal Act on Data Protection (FADP)."
        },
        {
          title: "2. Categories of Information Processed",
          content: "We process only data essential for corporate compliance and transactional verification:",
          list: [
            "Corporate registry extracts, articles of association, and VAT/tax registrations.",
            "Identity documents of authorized representatives (Passports, National IDs, Biometrics).",
            "Sanctions and Politically Exposed Persons (PEP) screening records.",
            "Commodity specifications, laboratory Certificates of Analysis (COA), and inspection reports.",
            "Audit logs including IP addresses, active session tokens, and cryptographic access authorizations."
          ]
        },
        {
          title: "3. Cryptographic Document Protection",
          content: "All confidential trade documents uploaded to VALOREA MARKET are encrypted at rest with AES-256-GCM. Unredacted original files are never exposed to counterparties without explicit, revocable authorization granted directly by the document owner organization."
        },
        {
          title: "4. Data Retention & International Transfers",
          content: "Corporate records and transaction audit trails are securely retained in high-security Swiss data centers for ten (10) years in accordance with Swiss commercial code requirements."
        }
      ]
    },
    cookies: {
      breadcrumb: "Cookie Policy",
      badge: "Zero Third-Party Advertising Trackers",
      title: "Cookie & Session Storage Policy",
      updatedDate: "Last Updated: November 13, 2026",
      section1Title: "1. Our Cookie Philosophy",
      section1Content: "VALOREA MARKET respects institutional privacy. We exclusively deploy strictly necessary functional cookies required to maintain your authentication state and language preference. We do not use third-party behavioral advertising cookies or marketing tracking pixels.",
      section2Title: "2. Cookies Deployed",
      tableHeaders: { name: "Cookie Name", purpose: "Purpose", duration: "Duration", category: "Category" },
      tableRows: [
        { name: "NEXT_LOCALE", purpose: "Stores preferred UI language (8 supported)", duration: "1 Year", category: "Strictly Necessary" },
        { name: "valorea_session_token", purpose: "Encrypted JWT user authentication session and Passkey state", duration: "Session / 24 Hours", category: "Strictly Necessary" }
      ]
    },
    ncnda: {
      breadcrumb: "ICC 769 NCNDA",
      badge: "International Chamber of Commerce Model 769",
      title: "Non-Circumvention, Non-Disclosure & Working Agreement",
      subtitle: "Mandatory Binding Electronic Execution Prior to Deal Room Disclosure",
      sections: [
        {
          title: "1. Non-Circumvention Covenants",
          content: "The signing parties agree not to circumvent, avoid, bypass, or obviate each other or VALOREA MARKET, directly or indirectly, with respect to transactions, sources, clients, suppliers, or intermediaries introduced through the VALOREA MARKET platform. This obligation shall remain valid for a period of five (5) years from the date of initial introduction."
        },
        {
          title: "2. Strict Confidentiality of Commercial Specs",
          content: "All proprietary technical documents, laboratory assays, refinery allocation letters, and commercial pricing structures exchanged in VALOREA MARKET deal rooms shall be held in strict confidence. Parties shall not duplicate, publish, or reveal such information to third parties without prior written consent."
        },
        {
          title: "3. Liquidated Damages & Enforcement",
          content: "In the event of an intentional circumvention or unauthorized direct contracting between counterparties introduced by VALOREA MARKET, the violating entity agrees to pay liquidated damages equal to three times (3x) the total anticipated brokerage commission of the transaction, plus all legal fees incurred in enforcement."
        }
      ]
    },
    brokerage: {
      breadcrumb: "Brokerage Policy",
      badge: "USD Benchmark Policy",
      title: "Brokerage Mandate & Settlement Rules",
      subtitle: "Institutional Fee Structures, Milestone Invoicing, and Non-Custodial Cargo Settlement",
      sections: [
        {
          title: "1. Non-Custodial Physical Cargo Settlement",
          notice: "Important: VALOREA MARKET is an intermediary technology broker and does not receive, custody, or disburse the principal purchase funds for physical commodity deliveries.",
          content: "The settlement of physical cargo (crude oil cargoes, refined fuel parcels, metric tons of fertilizers, metals, or sugar) must be completed directly between the authorized commercial banking accounts of the Buyer and Supplier. Acceptable instruments include Irrevocable Documentary Letters of Credit (DLC), Standby Letters of Credit (SBLC), or Bank Guarantees."
        },
        {
          title: "2. Brokerage Commission Structure",
          content: "VALOREA MARKET earns an institutional brokerage fee (0.50% to 1.50% of total cargo contract value, benchmarked in USD, based on contract volume and annual cadence) for its match discovery, compliance due diligence, deal room hosting, and intermediary supervision services.",
          list: [
            "Fees are denominated in USD regardless of the contract's local billing currency.",
            "Obligor allocation (Buyer, Supplier, or 50/50 split) is formally codified in the bilateral Trade Agreement."
          ]
        },
        {
          title: "3. Milestone Invoicing & Payment Terms",
          content: "Brokerage fees mature upon verified contractual milestones (e.g. Letter of Credit operative confirmation, SGS inspection release, or Bill of Lading issuance). VALOREA MARKET issues a formal Swiss VAT-compliant tax invoice payable within fifteen (15) banking days."
        }
      ]
    },
    catalog: {
      backHome: "Back to Home",
      topBanner: "VALOREA MARKET Global Verified Commodity Catalog (7 Sectors)",
      badge: "International Trade Specifications",
      title: "Commodity Catalog & Specifications",
      subtitle: "Explore standardized grades, delivery parameters, and inspection requirements across global commodities.",
      searchPlaceholder: "Search (e.g. Brent, EN590, Urea, Copper, Sugar)...",
      allSectors: "All Sectors",
      sgsInspected: "SGS Inspected",
      benchmarkSpecs: "Benchmark Specifications:",
      pricingBasis: "Pricing Basis:",
      pricingValue: "USD / Metric Ton",
      incoterms: "Incoterms:",
      incotermsValue: "FOB / CIF / CFR (Incoterms 2020)",
      buyRequest: "Buy Request",
      supplyOffer: "Supply Offer",
      noResults: "No commodities matched your search query",
      resetFilters: "Reset filters",
      footerText: "VALOREA MARKET International Commodities Catalog • Benchmark Reference USD"
    },
    auth: {
      backHome: "Back to Home",
      signInBadge: "Verified Corporate Portal",
      signInTitle: "Sign in to VALOREA MARKET",
      signInSubtitle: "Encrypted access to deal rooms, brokerage command, and compliance",
      registerBadge: "Enterprise Registration",
      registerTitle: "Register Your Corporation on VALOREA MARKET",
      registerSubtitle: "Begin entity verification and trade physical global commodities",
      emailLabel: "Enterprise Email Address",
      emailPlaceholder: "name@company.com",
      passwordLabel: "Password",
      passwordPlaceholder: "••••••••••••",
      confirmPasswordLabel: "Confirm Password",
      companyLabel: "Registered Legal Entity Name",
      countryLabel: "Country of Incorporation",
      fullNameLabel: "Authorized Representative Name",
      mfaTitle: "Multi-Factor Authentication (MFA)",
      mfaSubtitle: "Enter the 6-digit authentication code from your authenticator app",
      mfaCodeLabel: "6-Digit Security Code",
      verifyMfaBtn: "Verify & Access Platform",
      signInBtn: "Sign In Securely",
      registerBtn: "Submit Enterprise Application",
      passkeyBtn: "Sign in with Passkey (FIDO2 WebAuthn)",
      forgotPassword: "Forgot password?",
      noAccount: "Don't have a verified account?",
      registerLink: "Register your enterprise",
      alreadyAccount: "Already registered?",
      signInLink: "Sign in here",
      agreeTerms: "I agree to the Terms of Service, NCNDA Agreement, and Privacy Policy",
      errorRequired: "Please enter your registered credentials.",
      errorMfa: "Please enter a valid 6-digit authenticator code."
    },
    broker: {
      breadcrumb: "Broker Management",
      badge: "Broker Supervision Active",
      title: "VALOREA MARKET Broker Command Center",
      subtitle: "Algorithmic commodity trade matching, supervised negotiation oversight, compliance lock verification, and fee ledger management.",
      refresh: "Refresh Matches",
      pendingProp: "Active Trade Proposals",
      pendingSubtitle: "Awaiting broker review",
      openRooms: "Open Deal Rooms",
      openRoomsSubtitle: "Supervised negotiation underway",
      projectedCommissions: "Projected Commissions (USD)",
      commissionsSubtitle: "Tied to contract milestones",
      complianceLock: "Compliance Gating",
      complianceLockSubtitle: "Unverified trades locked",
      buyer: "Buyer",
      supplier: "Supplier",
      commodity: "Commodity",
      volume: "Volume",
      benchmarkPrice: "Benchmark Price",
      commission: "Broker Commission",
      actions: "Actions",
      reviewApprove: "Review & Approve",
      openDealRoom: "Enter Deal Room",
      reject: "Reject"
    },
    compliance: {
      breadcrumb: "Compliance Portal",
      badge: "Institutional Due Diligence",
      title: "Compliance & Verification Registry",
      subtitle: "Institutional KYB, Representative KYC, and continuous sanctions screening.",
      allScopes: "All Scopes",
      kybScope: "Company Registry (KYB)",
      kycScope: "Representative (KYC)",
      cargoScope: "Cargo Supply Title",
      sanctionsScope: "Sanctions & PEP Screening",
      approved: "Approved",
      pendingReview: "Pending Review",
      additionalInfo: "Additional Info Required",
      incomplete: "Incomplete",
      rejected: "Rejected",
      expired: "Expired",
      suspended: "Suspended",
      company: "Company",
      scope: "Scope",
      status: "Status",
      lastUpdated: "Last Updated",
      actions: "Actions",
      viewDetails: "View Details"
    },
    billing: {
      breadcrumb: "Billing & Invoices",
      badge: "USD Invoicing & Clearing",
      title: "Subscriptions & Invoicing",
      subtitle: "USD-denominated company subscriptions and transaction brokerage commission invoices.",
      currentPlan: "Current Active Plan",
      monthlyBilling: "Monthly Billing",
      annualBilling: "Annual Billing (Save 20%)",
      upgradePlan: "Upgrade Subscription",
      invoicesTitle: "Formal Tax Invoices",
      downloadPdf: "Download Swiss PDF Invoice",
      milestoneNotice: "Brokerage commission invoices mature upon verified contract milestones.",
      seats: "Trading Seats",
      renewal: "Renewal Date"
    },
    security: {
      breadcrumb: "Security & Sessions",
      badge: "OWASP ASVS L2 Certified",
      title: "Security & Session Management",
      subtitle: "FIDO2 WebAuthn Passkeys, phishing-resistant multi-factor authentication, and centralized session revocation.",
      passkeyTitle: "FIDO2 Passkeys",
      passkeyDesc: "Passkeys provide cryptographic, phishing-proof authentication backed by device biometric enclaves or hardware security keys.",
      registerPasskey: "Register New Passkey",
      activeSessions: "Active Authenticated Sessions",
      currentSession: "Current Device",
      revokeAll: "Revoke All Other Sessions",
      enrolledKeys: "Enrolled Hardware Keys:",
      lastActive: "Last Active",
      ipAddress: "IP Address",
      browser: "Browser"
    }
  },
  fr: {
    common: {
      backHome: "Retour à l'accueil",
      home: "Accueil",
      loading: "Chargement...",
      error: "Une erreur inattendue est survenue",
      usdReference: "Référence de cotation en USD",
      verifiedBrokerage: "Courtage international vérifié"
    },
    about: {
      breadcrumb: "À propos de nous",
      badge: "Infrastructure Institutionnelle de Courtage de Matières Premières",
      title: "Connecter les Marchés Mondiaux avec Confiance et Rigueur",
      subtitle: "VALOREA MARKET est une plateforme internationale de courtage institutionnel conçue pour combler les déficits de confiance dans le négoce physique transfrontalier.",
      pillar1Title: "Règlement Non-Dépositaire (Non-Custodial)",
      pillar1Desc: "VALOREA MARKET ne détient jamais les fonds de cargaison physique. Les paiements s'effectuent directement entre banques commerciales par Lettre de Crédit (DLC / SBLC).",
      pillar2Title: "Vérification Multistade (KYC/KYB)",
      pillar2Desc: "Chaque entité fait l'objet d'une authentification du registre commercial, du représentant légal et du bénéficiaire effectif (UBO), avec filtrage des sanctions (OFAC, UE, ONU, UK).",
      pillar3Title: "Salles de Négociation E2EE",
      pillar3Desc: "Visioconférences chiffrées de bout en bout, inspection de documents techniques filigranés et interception active des fuites de coordonnées.",
      hubsBadge: "Réseau Mondial de Desks",
      hubsTitle: "Présence Opérationnelle dans les Grands Hubs de Négoce",
      hubs: [
        { name: "Genève, Suisse", role: "Siège Mondial & Gouvernance", desc: "Rue du Rhône 42, 1204 Genève. Conformité, droit des affaires et arbitrage suisse." },
        { name: "Dubaï, ÉAU", role: "Hub Moyen-Orient & Énergie", desc: "DIFC Gate Precinct 4. Pétrole brut, carburants raffinés et pétrochimie." },
        { name: "Singapour", role: "Desk Asie-Pacifique", desc: "Marina Bay Financial Centre. GNL, métaux industriels et engrais minéraux." },
        { name: "Houston, États-Unis", role: "Opérations Amériques", desc: "1000 Louisiana St, Houston, TX. Contrats WTI, gaz naturel et pétrochimie." }
      ],
      governanceTitle: "Gouvernance et Conformité Suisse",
      governanceDesc: "VALOREA MARKET applique strictement le droit commercial suisse et les standards internationaux de conformité bancaire."
    },
    contact: {
      breadcrumb: "Contact",
      badge: "Support International 24/7 Négoce & Conformité",
      title: "Contacter les Desks Institutionnels VALOREA MARKET",
      subtitle: "Prenez contact avec nos courtiers et juristes d'affaires. Canaux chiffrés disponibles pour la structuration d'opérations hautement confidentielles.",
      formTitle: "Soumettre une Demande de Négoce ou d'Agrément",
      nameLabel: "Nom Complet du Représentant",
      namePlaceholder: "Tel qu'indiqué sur la pièce d'identité",
      companyLabel: "Raison Sociale de l'Entreprise",
      companyPlaceholder: "Nom légal officiel de l'entité",
      emailLabel: "Adresse E-mail Professionnelle",
      emailPlaceholder: "nom@entreprise.com",
      sectorLabel: "Secteur de Matières Premières",
      messageLabel: "Spécifications de la Demande",
      messagePlaceholder: "Précisez le produit, le volume, le port de livraison et l'échéancier souhaité...",
      submitBtn: "Envoyer la Demande",
      submitting: "Transmission sécurisée...",
      successTitle: "Demande reçue avec succès",
      successDesc: "Un courtier agréé du desk compétent vous répondra sous 4 heures ouvrées.",
      desksTitle: "Bureaux de Courtage Agréés",
      desksSubtitle: "Canaux de communication directs",
      desks: [
        { name: "Siège de Genève", role: "Conformité & Gouvernance", email: "geneva.desk@valoreamarket.com", phone: "+41 22 819 9200", location: "Rue du Rhône 42, 1204 Genève" },
        { name: "Desk Régional Dubaï", role: "Pétrole Brut & Carburants", email: "dubai.desk@valoreamarket.com", phone: "+971 4 362 7500", location: "DIFC Gate Precinct 4, Dubai" },
        { name: "Desk Régional Singapour", role: "Métaux & Gaz Naturel", email: "singapore.desk@valoreamarket.com", phone: "+65 6818 6000", location: "Marina Bay Financial Centre, Tower 2" },
        { name: "Desk Régional Houston", role: "Brut & Condensats", email: "houston.desk@valoreamarket.com", phone: "+1 713 546 8000", location: "1000 Louisiana St, Houston, TX" }
      ]
    },
    faq: {
      breadcrumb: "FAQ",
      badge: "Guide de Conformité et Protocoles de Négoce",
      title: "Foire Aux Questions",
      subtitle: "Réponses complètes sur les mécanismes de courtage, l'agrément d'entreprise, le règlement de cargaison et la protection documentaire.",
      searchPlaceholder: "Rechercher une réponse...",
      allCategories: "Toutes les catégories",
      categories: [
        {
          category: "Agrément & Conformité (KYC/KYB)",
          questions: [
            {
              q: "Quelles sont les vérifications exigées pour participer à VALOREA MARKET ?",
              a: "La participation requiert une triple vérification : (1) Contrôle KYB de l'entité juridique et du registre des bénéficiaires effectifs (UBO) ; (2) Contrôle KYC du représentant légal et pouvoir d'engagement ; (3) Filtrage automatisé continu contre les listes de sanctions (OFAC, UE, ONU, UK)."
            },
            {
              q: "Comment VALOREA MARKET vérifie-t-elle les droits sur la cargaison des fournisseurs ?",
              a: "Les fournisseurs doivent soumettre des justificatifs vérifiables tels que contrats d'allocation de raffinerie, reçus de stockage en réservoir terminal (TSR) ou connaissements maritimes vérifiés par nos officiers de conformité."
            },
            {
              q: "Qu'implique le verrouillage de conformité (Compliance Lock) ?",
              a: "Une entité en statut 'En attente' ou 'Suspendu' ne peut accéder aux salles de négociation ni émettre d'offres tant que sa conformité n'est pas intégralement rétablie."
            }
          ]
        },
        {
          category: "Règlement & Canaux Bancaires",
          questions: [
            {
              q: "VALOREA MARKET détient-elle les fonds des cargaisons physiques ?",
              a: "Non, en aucun cas. VALOREA MARKET est strictement non-dépositaire. Le règlement financier s'effectue directement entre la banque de l'acheteur et celle du fournisseur via Lettre de Crédit Documentaire (DLC / SBLC) ou virement bancaire (TT)."
            },
            {
              q: "Pourquoi le dollar américain (USD) sert-il de devise de référence ?",
              a: "Les matières premières physiques internationales sont cotées et négociées mondialement en USD. VALOREA MARKET affiche les équivalents en USD pour assurer une comparabilité parfaite et transparente des offres."
            }
          ]
        },
        {
          category: "Salles de Négociation & Protection des Documents",
          questions: [
            {
              q: "Pourquoi le chat intercepte-t-il les numéros et e-mails ?",
              a: "Afin de protéger le mandat de courtage et d'appliquer l'accord de non-contournement ICC 769, les messages contenant des coordonnées externes sont assainis et contrôlés avant remise."
            },
            {
              q: "Les contreparties peuvent-elles télécharger mes documents originaux ?",
              a: "Aucun tiers ne peut télécharger les originaux non caviardés sans autorisation expresse de l'entité propriétaire. Seules des prévisualisations filigranées dynamiques sont accessibles."
            }
          ]
        },
        {
          category: "Accords Juridiques & Commissions",
          questions: [
            {
              q: "Quel accord NCNDA régit la plateforme ?",
              a: "La plateforme applique le Modèle 769 de la Chambre de Commerce Internationale (CCI), juridiquement contraignant pendant 5 ans."
            },
            {
              q: "Quand la commission de courtage est-elle exigible ?",
              a: "La commission devient exigible lors de la réalisation des jalons contractuels (confirmation de la Lettre de Crédit, rapport d'inspection SGS ou connaissement Clean on Board), payable sous 15 jours bancaires."
            }
          ]
        }
      ],
      ctaTitle: "Une question spécifique concernant une transaction ?",
      ctaDesc: "Notre équipe de courtiers et juristes de conformité est à votre disposition.",
      ctaBtn: "Contacter le Bureau de Courtage"
    },
    terms: {
      breadcrumb: "Conditions de Service",
      badge: "Contrat Institutionnel B2B",
      title: "Conditions Générales d'Utilisation",
      effectiveDate: "Date d'entrée en vigueur : 13 novembre 2026 • Juridiction : Genève, Suisse",
      sections: [
        {
          title: "1. Nature et Portée de la Plateforme",
          content: "VALOREA MARKET International AG exploite une plateforme électronique spécialisée de courtage commercial non-dépositaire reliant des entités vérifiées pour le négoce physique de matières premières."
        },
        {
          title: "2. Politique Non-Dépositaire et Règlement de Cargaison",
          content: "VALOREA MARKET ne perçoit ni ne séquestre le prix d'achat des matières premières physiques. Tout paiement est réglé directement de banque à banque via Lettre de Crédit Documentaire (DLC) ou Garantie Bancaire (SBLC)."
        },
        {
          title: "3. Agrément et Régimes de Sanctions",
          content: "L'accès aux deal rooms requiert le maintien du statut 'Approuvé'. Toute entité ciblée par des sanctions internationales (OFAC, UE, ONU, UK) est immédiatement suspendue de la plateforme."
        },
        {
          title: "4. Non-Contournement et Confidentialité (CCI 769)",
          content: "Tout membre est lié par l'accord ICC 769. Tout contournement de la plateforme entraîne des dommages-intérêts forfaitaires équivalant au triple de la commission de courtage totale estimée."
        },
        {
          title: "5. Droit Applicable et Arbitrage Suisse",
          content: "Les présentes conditions sont régies par le droit matériel suisse. Tout différend sera soumis à l'arbitrage exclusif du Swiss Arbitration Centre à Genève."
        }
      ]
    },
    privacy: {
      breadcrumb: "Politique de Confidentialité",
      badge: "Conforme RGPD et LPD Suisse révisée",
      title: "Politique de Confidentialité et Protection des Données",
      effectiveDate: "Date d'effet : 13 novembre 2026 • Responsable du traitement : VALOREA MARKET International AG, Genève",
      sections: [
        {
          title: "1. Engagement de Confidentialité",
          content: "VALOREA MARKET International AG applique strictement les exigences du Règlement Général sur la Protection des Données de l'Union Européenne (RGPD) et de la Loi fédérale suisse sur la protection des données (LPD)."
        },
        {
          title: "2. Catégories de Données Traitées",
          content: "Nous traitons uniquement les informations requises pour la conformité et le négoce :",
          list: [
            "Extraits du registre du commerce, statuts et immatriculations fiscales/TVA.",
            "Documents d'identité officiels des représentants habilités (passeports, biométrie).",
            "Sujétions aux listes de sanctions et Personnes Politiquement Exposées (PEP).",
            "Certificats d'analyse (COA), rapports d'inspection technique (SGS) et connaissements.",
            "Journaux de sécurité, adresses IP et clés d'accès cryptographiques Passkey FIDO2."
          ]
        },
        {
          title: "3. Sécurité Cryptographique des Fichiers",
          content: "Tous les documents commerciaux sont chiffrés au repos en AES-256-GCM. Aucun document original n'est rendu accessible sans autorisation expresse et révocable de l'entité émettrice."
        },
        {
          title: "4. Conservation en Suisse",
          content: "Les données d'audit et registres sont conservés dans des centres de données suisses hautement sécurisés pendant dix (10) ans conformément au code des obligations suisse."
        }
      ]
    },
    cookies: {
      breadcrumb: "Politique des Cookies",
      badge: "Exempt de tout traceur publicitaire tiers",
      title: "Politique relative aux Cookies et Sessions",
      updatedDate: "Dernière mise à jour : 13 novembre 2026",
      section1Title: "1. Principe de Sobriété Numérique",
      section1Content: "VALOREA MARKET déploie exclusivement les cookies techniques strictement indispensables au maintien de votre session chiffrée et de votre langue d'interface.",
      section2Title: "2. Cookies Déployés",
      tableHeaders: { name: "Nom du Cookie", purpose: "Finalité", duration: "Durée", category: "Catégorie" },
      tableRows: [
        { name: "NEXT_LOCALE", purpose: "Mémorisation de la langue d'interface (8 langues)", duration: "1 an", category: "Strictement Nécessaire" },
        { name: "valorea_session_token", purpose: "Jeton de session utilisateur chiffré JWT et statut Passkey", duration: "24 heures / Session", category: "Strictement Nécessaire" }
      ]
    },
    ncnda: {
      breadcrumb: "Accord NCNDA",
      badge: "Modèle 769 de la Chambre de Commerce Internationale",
      title: "Accord de Non-Contournement et de Non-Divulgation",
      subtitle: "Signature électronique obligatoire préalable à toute divulgation commerciale",
      sections: [
        {
          title: "1. Engagements de Non-Contournement",
          content: "Les parties s'interdisent formellement de contourner directement ou indirectement VALOREA MARKET ou les partenaires présentés. Cet engagement demeure valide pour une durée de cinq (5) ans à compter de la première mise en relation."
        },
        {
          title: "2. Confidentialité Stricte des Spécifications",
          content: "Les certificats de raffinerie, analyses SGS, prix et volumes échangés en salle de négociation constituent des secrets d'affaires protégés et ne peuvent être divulgués à des tiers."
        },
        {
          title: "3. Dommages-Intérêts Forfaitaires",
          content: "En cas de contournement avéré, la partie défaillante sera tenue au versement immédiat d'une indemnité forfaitaire correspondant à trois fois (3x) la commission de courtage totale estimée."
        }
      ]
    },
    brokerage: {
      breadcrumb: "Politique de Courtage",
      badge: "Cotation Référencée en USD",
      title: "Mandat de Courtage et Règles de Règlement",
      subtitle: "Barème des commissions, facturation par jalons et dénouement commercial non-dépositaire",
      sections: [
        {
          title: "1. Règlement Non-Dépositaire des Cargaisons",
          notice: "Rappel crucial : VALOREA MARKET n'encaisse ni ne détient les fonds d'achat des marchandises physiques.",
          content: "Le règlement des cargaisons (pétrole brut, carburants, engrais, métaux, sucre) s'effectue exclusivement de banque à banque par Lettre de Crédit Documentaire Irrévocable (DLC) ou Garantie Bancaire (SBLC)."
        },
        {
          title: "2. Structure de Commission de Courtage",
          content: "VALOREA MARKET perçoit une commission de courtage usuelle de 1,00 % à 1,50 % de la valeur contractuelle totale de la cargaison, libellée en USD.",
          list: [
            "Les honoraires sont décomptés en USD quelle que soit la devise de facturation locale.",
            "La répartition du débiteur (acheteur, vendeur ou partagé) est formalisée dans l'accord de courtage bilatéral."
          ]
        },
        {
          title: "3. Facturation Échelonnée et Délais",
          content: "La commission devient exigible dès la validation des jalons opérationnels (confirmation de DLC, émission du rapport SGS ou remise du connaissement Clean on Board), payable sous 15 jours bancaires."
        }
      ]
    },
    catalog: {
      backHome: "Retour à l'accueil",
      topBanner: "Catalogue VALOREA MARKET des Matières Premières Internationales (7 Secteurs)",
      badge: "Spécifications du Commerce International",
      title: "Catalogue des Matières Premières & Spécifications",
      subtitle: "Consultez les grades standardisés, paramètres de livraison et exigences de contrôle pour 7 secteurs clés.",
      searchPlaceholder: "Rechercher (ex. Brent, EN590, Urée, Cuivre, Sucre)...",
      allSectors: "Tous les secteurs",
      sgsInspected: "Contrôlé SGS",
      benchmarkSpecs: "Spécifications de Référence :",
      pricingBasis: "Base de Cotation :",
      pricingValue: "USD / Tonne Métrique",
      incoterms: "Incoterms :",
      incotermsValue: "FOB / CIF / CFR (Incoterms 2020)",
      buyRequest: "Demande d'Achat",
      supplyOffer: "Offre d'Approvisionnement",
      noResults: "Aucune matière première ne correspond à votre recherche",
      resetFilters: "Réinitialiser les filtres",
      footerText: "Catalogue des Matières Premières VALOREA MARKET • Référence de cotation en USD"
    },
    auth: {
      backHome: "Retour à l'accueil",
      signInBadge: "Portail Entreprise Vérifié",
      signInTitle: "Connexion à VALOREA MARKET",
      signInSubtitle: "Accès chiffré aux deal rooms, au desk de courtage et à la conformité",
      registerBadge: "Inscription Entreprise",
      registerTitle: "Enregistrer votre Entreprise sur VALOREA MARKET",
      registerSubtitle: "Démarrez l'agrément institutionnel pour négocier sur les marchés physiques",
      emailLabel: "Adresse E-mail Professionnelle",
      emailPlaceholder: "nom@entreprise.com",
      passwordLabel: "Mot de Passe",
      passwordPlaceholder: "••••••••••••",
      confirmPasswordLabel: "Confirmer le Mot de Passe",
      companyLabel: "Raison Sociale de l'Entité",
      countryLabel: "Pays d'Immatriculation",
      fullNameLabel: "Nom du Représentant Habilité",
      mfaTitle: "Authentification à Deux Facteurs (2FA)",
      mfaSubtitle: "Saisissez le code à 6 chiffres généré par votre application d'authentification",
      mfaCodeLabel: "Code de Sécurité à 6 Chiffres",
      verifyMfaBtn: "Valider et Accéder à la Plateforme",
      signInBtn: "Se Connecter en Toute Sécurité",
      registerBtn: "Soumettre la Candidature d'Entreprise",
      passkeyBtn: "Se connecter avec Passkey (FIDO2 WebAuthn)",
      forgotPassword: "Mot de passe oublié ?",
      noAccount: "Vous n'avez pas de compte agréé ?",
      registerLink: "Inscrire votre entreprise",
      alreadyAccount: "Déjà inscrit ?",
      signInLink: "Se connecter ici",
      agreeTerms: "J'accepte les Conditions de Service, l'Accord NCNDA et la Politique de Confidentialité",
      errorRequired: "Veuillez renseigner tous les champs obligatoires.",
      errorMfa: "Veuillez saisir un code d'authentification valide à 6 chiffres."
    },
    broker: {
      breadcrumb: "Gestion du Courtage",
      badge: "Supervision du Courtage Active",
      title: "Centre de Commande du Courtier VALOREA MARKET",
      subtitle: "Appariement algorithmique des offres, supervision des négociations, verrouillage de conformité et gestion des commissions.",
      refresh: "Actualiser les Affaires",
      pendingProp: "Propositions en Attente",
      pendingSubtitle: "En attente d'approbation courtier",
      openRooms: "Salles de Négociation Actives",
      openRoomsSubtitle: "Négociations supervisées en cours",
      projectedCommissions: "Commissions Estimées (USD)",
      commissionsSubtitle: "Liées aux jalons contractuels",
      complianceLock: "Contrôle de Conformité",
      complianceLockSubtitle: "Transactions non vérifiées verrouillées",
      buyer: "Acheteur",
      supplier: "Fournisseur",
      commodity: "Matière Première",
      volume: "Volume",
      benchmarkPrice: "Prix de Référence",
      commission: "Commission Courtier",
      actions: "Actions",
      reviewApprove: "Examiner & Approuver",
      openDealRoom: "Entrer en Salle de Négociation",
      reject: "Rejeter"
    },
    compliance: {
      breadcrumb: "Portail Conformité",
      badge: "Due Diligence Institutionnelle",
      title: "Registre de Conformité et d'Agrément",
      subtitle: "Agrément KYB d'entité, vérification KYC du représentant et filtrage continu des sanctions.",
      allScopes: "Tous les Domaines",
      kybScope: "Registre Commercial (KYB)",
      kycScope: "Représentant Légal (KYC)",
      cargoScope: "Titre de Cargaison",
      sanctionsScope: "Filtrage Sanctions & PEP",
      approved: "Approuvé",
      pendingReview: "En Cours d'Examen",
      additionalInfo: "Complément Requis",
      incomplete: "Incomplet",
      rejected: "Rejeté",
      expired: "Expiré",
      suspended: "Suspendu",
      company: "Entreprise",
      scope: "Domaine",
      status: "Statut",
      lastUpdated: "Dernière Mise à Jour",
      actions: "Actions",
      viewDetails: "Voir les Détails"
    },
    billing: {
      breadcrumb: "Facturation & Invoices",
      badge: "Facturation & Compensation en USD",
      title: "Abonnements et Facturation",
      subtitle: "Gestion des forfaits d'entreprise en USD et factures de commission de courtage.",
      currentPlan: "Forfait Actuel",
      monthlyBilling: "Facturation Mensuelle",
      annualBilling: "Facturation Annuelle (-20%)",
      upgradePlan: "Mettre à Niveau le Forfait",
      invoicesTitle: "Factures Fiscales Officielles",
      downloadPdf: "Télécharger Facture Suisse PDF",
      milestoneNotice: "Les commissions de courtage sont exigibles lors de la réalisation des jalons contractuels.",
      seats: "Postes de Négoce",
      renewal: "Date de Renouvellement"
    },
    security: {
      breadcrumb: "Sécurité & Sessions",
      badge: "Certifié OWASP ASVS L2",
      title: "Gestion de la Sécurité et des Sessions",
      subtitle: "Passkeys FIDO2 WebAuthn, authentification multifacteur résistante au phishing et révocation des accès.",
      passkeyTitle: "Passkeys Matérielles FIDO2",
      passkeyDesc: "Authentification cryptographique sans mot de passe adossée à une enclave biométrique ou clé physique.",
      registerPasskey: "Enregistrer une Nouvelle Passkey",
      activeSessions: "Sessions Actives Authentifiées",
      currentSession: "Appareil Actuel",
      revokeAll: "Révoquer Toutes les Autres Sessions",
      enrolledKeys: "Clés Matérielles Enregistrées :",
      lastActive: "Dernière Activité",
      ipAddress: "Adresse IP",
      browser: "Navigateur"
    }
  }
};

// Fallback logic for remaining locales (es, zh-Hans, ja, de, ru)
const otherLocales = ["es", "zh-Hans", "ja", "de", "ru"];
otherLocales.forEach((l) => {
  if (!SUBPAGES_DATA[l]) {
    SUBPAGES_DATA[l] = JSON.parse(JSON.stringify(SUBPAGES_DATA.en));
  }
});

export function getSubpageTranslations(locale: string): SubpageContent {
  return SUBPAGES_DATA[locale] || SUBPAGES_DATA.en;
}
