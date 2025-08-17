import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const am = {
  welcome: "ሰላም",
  welcome_back: "እንኳን ደህና መጡ",
  home_mainTitle: "ወደ መኪና ኪራይ እንኳን በደህና መጡ",
  home_subTitle: "ትክክለኛውን መኪና ያግኙ",
  hero_title1: "AfriCar",
  hero_title2: "የመዋቢያ ዕቃዎች አቅርቦት",
  hero_desc1: "ከሱቃችን ወደ በርዎ፡",
  hero_desc2: "ዛሬ የቀላቲ ጸጉር እና መዋቢያዎችን ይግዙ!",
  featured_froducts: "የተመረጡ አቅርቦቶች",
  shop_by_category: "በምድብ ይምረጡ",
  shop: "ሱቅ",
  categories: "ምድቦች",
  back_to_categories: "ወደ ዋና ማውጫ ይመለሱ",
  brand: "የምርት ስምዎች",
  featured_brands: "የተመረጠ የምርት ስምዎች",
  products: "የሚገኙ ዝርዝሮች",
  resluts: "ውጤት",
  profile: "ፕሮፋይል",
  detail: "ዝርዝር",
  track_order: "ግዢ ተከታተል",
  check_item: "እቃዎን ይፈትሹ",
  order_confirmation: "የግዢ መረከብ",
  contact_us: "ያግኙን",
  logout: "ውጣ",
  sign_in: "መግባት",
  sign_desc: "የተጠቀምነው የመግባት መረጃ ይምረጡ",
  phoneEmail: "ስልክ ወይም ኢሜል",
  password: "የይለፍ ቃል",
  forget: "የይለፍ ቃል ረስተዋል ?",
  sign_up: "መለያ ፍጠር",
  sign_up_desc: "የተጠቀምነው የመግባት መረጃ ይምረጡ",
  fullname: "ሙሉ ስም",
  phone: "ስልክ",
  email: "ኢሜይል",
  confirm_password: "የይለፍ ቃል አረጋግጥ",
  cart: "ቦርሳ",
  continue_shopping: "መገብዮትን ይቀጥሉ",
  Your_cart_is_empty: "ቦርሳው ባዶ ነው",
  track_order_desc: "የስልክ ቁጥርዎን እና የትእዛዝ ቁጥሩን ከዚህ በታች በማቅረብ ትእዛዝዎን ያከታተሉ።",
  see_order_history: "See Order history",
  order_number: "የትእዛዝ ቁጥር",
  check_order: "አረጋግጥ",
  check_item_desc: "በቀረበው SKU የምርቱን ነገር ኦሪጅናልነት ያረጋግጡ",
  insert_item_SKU: "የእቃውን SKU ያስገቡ",
  check: "ይፈትሹ",
  order_confirmation_desc:
    "የገዟቸውን እቃዎች ማረጋገጥዎን ያረጋግጡ፣ ማንኛውም ችግር ካጋጠመዎት ሙሉ በሙሉ ተመላሽ ሊሆኑ ይችላሉ።",
  order_confirmation_desc2:
    "በ SMS ወይም በኢሜል የተቀበሉት የትዕዛዝ ኮድ ፣ ምንም ነገር ካልተቀበሉ እባክዎን አስተላላፊውን የድጋፍ ቡድን እንዲያነጋግር ይንገሩ።",
  check_order2: "ትዕዛዙን ያረጋግጡ",
  constact_us_desc: "መልእክትዎን እዚህ ያስቀምጡ።",
  name: "ስም",
  message: "መልእክት",
  send: "ይላኩ",
  birr: "ብር",
  checkout_items: "ጨርሰህ አውጣ",
  items: "እቃዎች",
  home: "መነሻ",
  total: "ጠቅላላ",
  add_to_art: "ወደ ግዢ አክል",
  result: "ወጤት",
  results: "ወጤቶች",
  shop_now: "አሁን ይሸምቱ",
  about_us: "ስለ ቀላቲ",
  about_kelati: "ስለ ቀላቲ",
  about_kelati_desc:
    "በአዲስ አበባ ቦሌ መድሃኔአለም ሞል እና በዱባይ የሚገኝ ጥራቱን የጠበቀ ሱቅ ሲሆን ልዩ የሆነ የሰው ፀጉር፣ሰው ሰራሽ ፀጉር፣ኮስሞቲክስ እና የውበት ምርቶችን በመሸጥ ላይ ነው። ብዙ አይነት የፀጉር ማስረዘሚያ፣ ዊግ፣ እና የፀጉር እንክብካቤ ምርቶች አሉን። እንዲሁም ሜካፕን፣ የቆዳ እንክብካቤ ምርቶችን፣ ሽቶዎችን እና ሌሎች የውበት አስፈላጊ ነገሮችን እንሸጣለን።",
  other_title: "ውብ ዕድሎች ከኛ ጋር ይገኛሉ",
  other_desc:
    "ቀላቲ, እኛ ከቁንጅና መደብር በላይ ነው። በብዙ መታመን የሚችል ጥራት ያላቸው ዕቃዎች እያስገባ ለተጠቃሚዎቹ የሚያደርስ በአዲስ አበባ እና በዱባይ መሠረት ያደረገ ሱቅ ነው።ሴቶች ያላቸውን ውበት እንዲያወጡ እንዲሁም የራስ መተማመናቸው እንዲጨምር የሚረዳ እና የሚያበረታታት ተቋም ነው።",
  mission: "ተልዕኮ",
  mission_desc:
    "በአዲስ አበባ እና በዱባይ ቀዳሚ የውበት መዳረሻ ለመሆን፣ ከፍተኛ ጥራት ያላቸውን የሰው ፀጉር፣ መዋቢያዎች እና የውበት አስፈላጊ ነገሮችን በማቅረብ ራስን የመግለጽ እና የማጎልበት ቦታን በማጎልበት። ከእያንዳንዱ ደንበኛ ጋር በግል ደረጃ ለመገናኘት እንጥራለን፣ ልዩ ፍላጎቶቻቸውን እና ፍላጎቶቻቸውን በመረዳት በራስ መተማመንን እና ውስጣዊ ውበትን እንዲያንጸባርቁ እንረዳለን።",
  values: "እሴቶች",
  values_desc:
    "ሁሉም ሴቶች ያላቸውን ውበት አጉልተው እንዲያወጡ እናበረታታለን ለዚህ ስራ አንደኛና ዋና ተመራጭ ነው ።ሴቶች ያላቸውን ውበት አጉልቶ እንዲያወጡ የራሱን ድርሻ ይጫወታል። የኛን ተጠቅመው ሴቶች ያገኙቻቸውን ውጤቶች ለሌሎች እንዲያጋሩ እናበረታታለን። ሁሉም ሴት ውብ ናት።",
  vision: "ራዕይ",
  vision_desc:
    "የአዲስ አበባ ሴቶች ውበታቸውን ተቀብለው ልዩ ልዩ ውበታቸውን የሚያከብሩበት አለምን እናስባለን። ቀላቲን የእያንዳንዱን ሴት ውበት ለማፍካት መሳሪያዎችን እና መነሳሳትን በመስጠት ለግል ለውጥ እንደ ማበረታቻ እናያለን። በጋራ ልምምዶች፣ በጋራ መደጋገፍ እና ለሁሉም ነገሮች በሚያምር ፍቅር ዙሪያ የተገነባ ንቁ ማህበረሰብ እናልማለን።",

  why_you_love_shopping_with_us: "ለምን ከእኛ ጋር መግዛትን ይወዳሉ",
  why_you_love_shopping_with_us_desc_one:
    "እኛ ቀላቲ ከቃላት በላይ ጥራታችን ይገልጸናል። ጠንካራ እና ጥራት ያላቸው ወደ ሀገር ውስጥ በማስገባት በተመጣጣኝ ዋጋ ለህዝብ በማድረስ እንታወቃለን ። ከመናገር ግብይትን በተጨማሪ በተለያዩ ባለሙያዎች እና ቴራፒዎች የተለያዩ የውበት ማስጠበቂያ እንዲሁም በራስ መተማመንን የሚጨምሩ የውበት አገልግሎቶችን በሰፊው እናደርሳለን ። እርስዎም ቀንና ሰዓት በመገኘት አገልግሎቶችን መጠቀም እንደሚችሉ እናሳስባለን።",
  why_you_love_shopping_with_us_desc_two:
    "ጥራት ከፍትሃዊነት ጋር ሲጣመር ትክክለኛውን ድም ያገኛል በምርቶቻችን የምንኮራችንን የተመሰገንን እንደ ሆነን ስንናገር በደስታ ነው። እያንዳንዱ ሴት የተለያዩ የውበት መጠበቃ መሳሪያዎችን እንድትጠቀም እናበረታታለን ምክንያቱም ውበቷ ጎልቶ እንዲወጣ እና እንዲታይ ስለምንፈልግ። የእርሶን ፍላጎት ተረትን በሚፈልጉት መልኩ ፍላጎትዎ ለማሳካት ሌተቀን እንደምንጥር ለማሳወቅ እንወዳለን ። ይምጡ እና የቀላቀሉን። እቃዎች ተወዳዳሪ በሌላቸው ጥራቶች እና ዋጋ በፈለጉት ጊዜ ወደ ቤቶ እናደርሳለን።",
  our_best_qualities: "የእኛ ምርጥ ባህሪያት",
  our_best_qualities_desc:
    "እኛ፣ በጥንካሬው፣ ጠራቱ እና በተመጣጣኝ ዋጋው ወደር ያልተገኘለት ሂውማን ሄር ስናቀርብ በደስታ ነው። በጥንካሬው፣ ጠራቱ እና በተመጣጣኝ ዋጋው ወደር ያልተገኘለት ሂውማን ሄር ስናቀርብ በደስታ ነው።",
  unmachable_servies_that_we_offer: "የምናቀርባቸው የማይቻሉ አገልግሎቶች",
  unmachable_servies_that_we_offer_desc:
    "እያንዳንዷ ሴት እራሷን የመግለጫ መሳሪያዎችን ማግኘት እንድትችል ከሚያስደስት የዕደ ጥበብ ጥበብ ጋር በተጣጣመ መልኩ በሚዘምሩ ትክክለኛ ዋጋዎች እናምናለን። ይምጡ፣ በኬላቲ ያለውን የውበት መዝሙር ይቀላቀሉ። የጥራት እና የማህበረሰብ ሹክሹክታ ወደ መቅደሳችን ይምራህ፣ እያንዳንዱ ዝርዝር ነገር ስለ ውበት ጊዜ የማይሽረው ቋንቋ ወደሚናገርበት። ለአንተ ልዩ ዜማ የተዘጋጀ ድንቅ ስራ የመጨረሻው ማበብ ይገባሃል።",
  our_best_spa: "ምርጥ እስፓ",
  our_best_spa_desc:
    "ወደ ፀጥታ ወደብ ይሂዱ። የባለሙያዎች እጆች በቅንጦት ማሸት፣ የፊት ቆዳን በሚያዝናና እና በሚያበረታቱ የሰውነት ህክምናዎች ጭንቀትዎን እንዲቦዝኑ ያድርጉ። ብቅ ብቅ ማለት የታደሰ፣ ሚዛኑን የጠበቀ እና አለምን በሚያንጸባርቅ ግሎ ለመጋፈጥ ዝግጁ ነው።",
  spa: "ስፓ",
  massage: "ማሳጅ",
  hair_dressing: "ፀጉር ማስዋብ",
  hair_dressing_desc:
    "የናንተ የኛ ድንቅ ስራ ነው። ድራማዊ ለውጥ፣ ረጋ ያለ ንክኪ፣ ወይም በቀላሉ የባለሙያ ምክር ቢመኙ፣ የእኛ የተካኑ ከስታይሊስቶቻችን አስማታቸውን ይሰራሉ። እኛ ቅጥያዎችን እንሰርባለን ፣ ግርፋትን እናገራለን እና የውስጣችሁን የፀጉር አምላክ እንፈታለን ፣ ወደ ጭንቅላት የሚዞሩ እና በራስ መተማመንዎን የሚጨምሩ ቁልፎችን ይተዉልዎታል።",
  styling: "መስራት",
  coloring: "ቀለም መቀባት",
  flawless_makeup: "እንከን የለሽ ሜካፕ",
  flawless_makeup_desc:
    "የተፈጥሮ ውበትህን የማድመቅ ጥበብን እናሳያለን። የኛ ባለሙያዎች ሜካፕ አርቲስቶቻችን የውስጣችሁን ብሩህነት ለግል በተዘጋጁ ምክክሮች፣ እንከን የለሽ አፕሊኬሽኖች እና እራስን የማስዋብ ጥበብን ለመቆጣጠር የባለሙያ ምክሮችን ያሳያሉ። አለምን ለመያዝ ተዘጋጅተው ይውጡ፣ እርስዎ እንደሆኑ የሚማርክ ልዕለ ኮኮብ በመመልከት እና ስሜት ይሰማዎት።",
  bridal: "ለሙሽሪት",
  casual: "ቀለል ያለ",
  skilled_nail_artists: "የተካኑ የጥፍር አርቲስቶች",
  skilled_nail_artists_desc:
    "ከስሱ እስከ አንጸባራቂ ዲዛይኖች ድረስ ጥንቅቅ አርገን እንሰራለን። ጠንካራ፣ ጤናማ እና የማይቋቋሙት ቆንጆ በሚያደርጋቸው የጣትዎን ጫፎች በሚያስደንቅ ማኒ-ፔዲስ፣ በሚያስደንቅ የጥፍር ጥበብ እንሸኞታለን።",
  gel: "ጄል",
  shillac: "ሺላክ",

  social_media: " ማህበራዊ ሚዲያ",
  purchase_history: "Purchase History",
  delete_account: "Delete account",
  home_occasionsTitle: "ለማንኛውም ዝግጅት መኪና ይከራዩ",
  home_occasionsSubtitle: "ከዕለት ተዕለት እስከ ያልተለመዱ ድረስ አስደናቂ የመኪና ምርጫዎችን ያስሱ።",
  home_exploreButton: "መኪናዎችን ያስሱ",
  home_airportTitle: "የአውሮፕላን ማረፊያ መውሰድ ቀላል ተደርጓል",
  home_airportSubtitle:
    "በአገር ውስጥ በመቶዎች በሚቆጠሩ አውሮፕላን ማረፊያዎች በአስተናጋጆች የሚቀርብ ቀላል መውሰድ።",
  home_airportButton: "በአውሮፕላን ማረፊያዎች ውስጥ መኪናዎችን ይፈልጉ",
  home_browseByDestination: "በመድረሻ ያስሱ",
  home_loading: "Loading...",
};

const en = {
  welcome: "Welcome",
  welcome_back: "Welcome Back",
  home_mainTitle: "Welcome to Car Rental",
  home_subTitle: "Find the perfect car",
  hero_title1: "Rent Smarter. Drive Freely",
  hero_title2: "Cosmetics Supply",
  hero_desc1: "Find the perfect car for any trip ",
  hero_desc2: "quick, safe, and hassle-free.!",
  featured_froducts: "Featured Cars",
  shop_by_category: "Shop by Category",
  shop: "Shop",
  categories: "Categories",
  back_to_categories: "Back to Categories",
  brand: "Brands",
  featured_brands: "Featured Brnads",
  products: "Products",
  resluts: "Resluts",
  profile: "Profile",
  detail: "Detail",
  track_order: "Track Order",
  check_item: "Check Item",
  order_confirmation: "Order Confirmation",
  contact_us: "Contact Us",
  logout: "Log out",
  sign_in: "Sign In",
  sign_desc: "Sign in using yout email or phone number to access your account",
  phoneEmail: `Phone\Email`,
  password: "Password",
  forget: " Forgot your password?",
  sign_up: "Sign up",
  sign_up_desc:
    "Sign in using your email or phone number to access your account.",
  fullname: "FullName",
  phone: "Phone",
  email: "Email",
  confirm_password: "Confirm Password",
  cart: "Order",
  continue_shopping: "Continue Shopping",
  Your_cart_is_empty: "Your cart is empty",
  track_order_desc:
    "Track your order by providing your phone number and order number below.",
  see_order_history: "See Order history",
  order_number: "Order#",
  check_order: "CHECK ORDER",
  check_item_desc: "Check the originality of product item by the provided SKU.",
  insert_item_SKU: "Insert Item SKU",
  check: "CHECK",
  order_confirmation_desc:
    " Make sure to check the items you purchased. If you come across any issue they are fully refundable.",
  order_confirmation_desc2:
    "The order code you received via SMS or Email. If you did not receive anything please tell the deliverer to contact support team.",
  check_order2: "CHECK ORDER",
  constact_us_desc: "Drop your message here",
  name: "Name",
  message: "Message",
  send: "Send",
  birr: "ETB",
  checkout_items: "Checkout",
  items: "items",
  home: "Home",
  total: "Total",
  add_to_art: "Add to Cart",
  result: "Result",
  results: "Results",
  shop_now: "Rent Now",
  about_us: "About Us",
  about_kelati: "About Kelati",
  about_kelati_desc:
    "Kelati Hair and Cosmetics Supply is a shop located in Addis Ababa and Naif Deira, Dubai that specializes in selling human hair, synthetic hair, cosmetics, and beauty products. We have a wide variety of hair extensions, wigs, weaves, braids, and hair care products to choose from. We also sell makeup, skincare products, perfumes, and other beauty essentials.",
  other_title: "The possibilities are beautiful",
  other_desc:
    "At Kelati, we are more than just a beauty store; we are a movement. We are your partners in transformation, your cheerleaders on the path to self-discovery, and your trusted confidantes in the world of beauty. Join us as we weave a tapestry of confidence, celebrate every shade of beauty, and empower the women of Addis Ababa to shine from within.",
  mission: "Mission",
  mission_desc:
    "To be the premier beauty destination in Addis Ababa, offering the highest quality human hair, cosmetics, and beauty essentials, while fostering a space for self-expression and empowerment. We strive to connect with every customer on a personal level, understanding their unique needs and desires to help them radiate confidence and inner beauty.",
  values: "Values",
  values_desc:
    "Quality We are relentless in our pursuit of excellence, offering only the finest human hair, ethically sourced and meticulously crafted. Community We believe in the power of connection and collaboration. Empowerment We are champions of self-expression and believe that every woman deserves to feel confident and beautiful in her own skin.Innovation We are constantly seeking new ways to enhance the beauty experience.Integrity We conduct our business with honesty and transparency, building trust with our customers and community.",
  vision: "Vision",
  vision_desc:
    "We envision a world where women of Addis Ababa embrace their individuality and celebrate their diverse beauty. We see Kelati as a catalyst for personal transformation, providing the tools and inspiration to unlock each woman's inner goddess. We dream of a vibrant community built around shared experiences, mutual support, and a passion for all things beautiful.",

  why_you_love_shopping_with_us: "Why you love shopping with us",
  why_you_love_shopping_with_us_desc_one:
    "We are the crescendo of beauty. Discerning souls drawn to an exquisite orchestration of quality find themselves at Kelati, where meticulously sourced human hair and curated cosmetics become instruments of self-expression. More than a mere transaction, we cultivate a sanctuary where confidence ignites under the gentle touch of expert stylists and skilled therapists. Within our elegant walls, beauty transcends the superficial, blossoming into a radiant tapestry woven with empowerment and personalized attention. For those who demand elegance in every detail, Kelati is the final flourish, a whispered invitation to step into the masterpiece of you. And yet, quality finds its truest voice when paired with fairness.",
  why_you_love_shopping_with_us_desc_two:
    "We believe in empowering every woman to access the tools of self-expression, which is why we meticulously curate our collections with affordability in mind. You will find no markups fueled by vanity, no whispers of exclusivity behind velvet ropes. At Kelati, fair prices sing in harmony with exquisite craftsmanship, ensuring that every woman can discover the artist within, paint her masterpiece, and bask in the confidence that true beauty is a right, not a privilege. Come, join the chorus of elegance at Kelati. Let the whispers of quality and fair price guide you into our sanctuary, where every detail speaks of beauty's timeless language. You deserve the final flourish, a masterpiece tailored to your unique melody. We'll be here, ready to listen, amplify, and celebrate the symphony of you.",
  our_best_qualities: "Our best qualities",
  our_best_qualities_desc:
    "We, at Kelati, understand that quality whispers more than words ever could. It speaks in the durability of our ethically sourced human hair, meticulously selected for its resilience and natural allure. It whispers in the impeccably crafted tools that grace our shelves, designed to last and elevate your artistry. Even the scent of our luxurious hair care products speaks of quality, woven with natural ingredients that nourish and protect your treasured strands. This is not simply a promise; it is a cornerstone of our ethos, a silent symphony of excellence playing out in every strand, every stroke, every moment within our walls.",
  unmachable_servies_that_we_offer: "Unmachable Servies that we offer",
  unmachable_servies_that_we_offer_desc:
    "We believe in fair prices that sing in harmony with exquisite craftsmanship, ensuring that every woman can access the tools of self-expression. Come, join the chorus of elegance at Kelati. Let the whispers of quality and community guide you into our sanctuary, where every detail speaks of beauty's timeless language. You deserve the final flourish, a masterpiece tailored to your unique melody. We'll be here, ready to listen, amplify, and celebrate the symphony of you. So come, dear friend, and let Kelati weave your beauty story.",
  our_best_spa: "Our best spa",
  our_best_spa_desc:
    "Drift away to a haven of tranquility. Let expert hands knead away your stress with luxurious massages, soothing facials, and invigorating body treatments. Emerge renewed, rebalanced, and ready to face the world with a radiant glow.",
  spa: "Spa",
  massage: "Massage",
  hair_dressing: "Hair Dressing",
  hair_dressing_desc:
    "Your mane is our masterpiece. Whether you crave a dramatic makeover, a gentle touch-up, or simply expert advice, our skilled stylists work their magic. We weave extensions, tame tangles, and unleash your inner hair goddess, leaving you with locks that turn heads and boost your confidence.",
  styling: "Styling",
  coloring: "Coloring",
  flawless_makeup: "Flawless Makeup",
  flawless_makeup_desc:
    "Discover the artistry of highlighting your natural beauty. Our expert makeup artists unveil your inner radiance with personalized consultations, flawless applications, and expert tips to master the art of self-embellishment. Walk out ready to take on the world, looking and feeling like the captivating superstar you are.",
  bridal: "Bridal",
  casual: "Casual",
  skilled_nail_artists: "Skilled Nail Artists",
  skilled_nail_artists_desc:
    "From delicate nudes to dazzling designs, your nails are a blank canvas for self-expression. We pamper your fingertips with meticulous mani-pedis, stunning nail art, and indulgent treatments that leave them strong, healthy, and irresistibly chic.",
  gel: "gel",
  shillac: "Shillac",
  social_media: "Social medial link",
  purchase_history: "Purchase History",
  delete_account: "Delete account",
  home_occasionsTitle: "Rent cars for any occasion",
  home_occasionsSubtitle:
    "Browse an incredible selection of cars, from the everyday to the extraordinary.",
  home_exploreButton: "Explore cars",
  home_airportTitle: "Airport pickup made easy",
  home_airportSubtitle:
    "Easy pickup offered by hosts at hundreds of airports across the country.",
  home_airportButton: "Search for cars at airports",
  home_browseByDestination: "Browse by destination",
  home_loading: "Loading...",
};

i18n.use(initReactI18next).init({
  // the translations
  // (tip move them in a JSON file and import them,
  // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
  resources: {
    en: {
      translation: en,
    },
    am: {
      translation: am,
    },
  },
  lng: "en",
  fallbackLng: "en",
  compatibilityJSON: "v3",
  interpolation: {
    escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
  },
});

async function confLocale() {
  console.log("confLocale ||||");
  const locale = await AsyncStorage.getItem("locale");
  if (locale != null) i18n.changeLanguage(locale);
}

confLocale();

export { confLocale };
export default i18n;
