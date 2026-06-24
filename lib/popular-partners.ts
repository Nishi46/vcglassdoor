export interface StaticPartner {
  name: string;
  firm: string;
  title: string;
  slug: string;
}

// 300 well-known VC partners — shown in search even without Airtable records
export const POPULAR_PARTNERS: StaticPartner[] = [
  // Sequoia Capital
  { name: "Doug Leone", firm: "Sequoia Capital", title: "Global Managing Partner", slug: "doug-leone-sequoia" },
  { name: "Roelof Botha", firm: "Sequoia Capital", title: "Managing Partner", slug: "roelof-botha-sequoia" },
  { name: "Mike Moritz", firm: "Sequoia Capital", title: "Partner", slug: "mike-moritz-sequoia" },
  { name: "Alfred Lin", firm: "Sequoia Capital", title: "Partner", slug: "alfred-lin-sequoia" },
  { name: "Jim Goetz", firm: "Sequoia Capital", title: "Partner", slug: "jim-goetz-sequoia" },
  { name: "Bryan Schreier", firm: "Sequoia Capital", title: "Partner", slug: "bryan-schreier-sequoia" },
  { name: "Pat Grady", firm: "Sequoia Capital", title: "Partner", slug: "pat-grady-sequoia" },
  { name: "Shaun Maguire", firm: "Sequoia Capital", title: "Partner", slug: "shaun-maguire-sequoia" },
  { name: "Konstantine Buhler", firm: "Sequoia Capital", title: "Partner", slug: "konstantine-buhler-sequoia" },
  // Andreessen Horowitz (a16z)
  { name: "Marc Andreessen", firm: "Andreessen Horowitz", title: "General Partner", slug: "marc-andreessen-a16z" },
  { name: "Ben Horowitz", firm: "Andreessen Horowitz", title: "General Partner", slug: "ben-horowitz-a16z" },
  { name: "Chris Dixon", firm: "Andreessen Horowitz", title: "General Partner", slug: "chris-dixon-a16z" },
  { name: "Andrew Chen", firm: "Andreessen Horowitz", title: "General Partner", slug: "andrew-chen-a16z" },
  { name: "Sriram Krishnan", firm: "Andreessen Horowitz", title: "General Partner", slug: "sriram-krishnan-a16z" },
  { name: "Martin Casado", firm: "Andreessen Horowitz", title: "General Partner", slug: "martin-casado-a16z" },
  { name: "Peter Levine", firm: "Andreessen Horowitz", title: "General Partner", slug: "peter-levine-a16z" },
  { name: "David Haber", firm: "Andreessen Horowitz", title: "General Partner", slug: "david-haber-a16z" },
  { name: "Vijay Pande", firm: "Andreessen Horowitz", title: "General Partner", slug: "vijay-pande-a16z" },
  { name: "Angela Strange", firm: "Andreessen Horowitz", title: "General Partner", slug: "angela-strange-a16z" },
  { name: "Justin Kan", firm: "Andreessen Horowitz", title: "General Partner", slug: "justin-kan-a16z" },
  { name: "Connie Chan", firm: "Andreessen Horowitz", title: "General Partner", slug: "connie-chan-a16z" },
  // Accel
  { name: "Rich Wong", firm: "Accel", title: "Partner", slug: "rich-wong-accel" },
  { name: "Ping Li", firm: "Accel", title: "Partner", slug: "ping-li-accel" },
  { name: "Sameer Gandhi", firm: "Accel", title: "Partner", slug: "sameer-gandhi-accel" },
  { name: "Steve Loughlin", firm: "Accel", title: "Partner", slug: "steve-loughlin-accel" },
  { name: "Arun Mathew", firm: "Accel", title: "Partner", slug: "arun-mathew-accel" },
  { name: "Ben Fletcher", firm: "Accel", title: "Partner", slug: "ben-fletcher-accel" },
  { name: "Miles Grimshaw", firm: "Accel", title: "Partner", slug: "miles-grimshaw-accel" },
  // Benchmark
  { name: "Bill Gurley", firm: "Benchmark", title: "General Partner", slug: "bill-gurley-benchmark" },
  { name: "Peter Fenton", firm: "Benchmark", title: "General Partner", slug: "peter-fenton-benchmark" },
  { name: "Chetan Puttagunta", firm: "Benchmark", title: "General Partner", slug: "chetan-puttagunta-benchmark" },
  { name: "Sarah Tavel", firm: "Benchmark", title: "General Partner", slug: "sarah-tavel-benchmark" },
  { name: "Eric Vishria", firm: "Benchmark", title: "General Partner", slug: "eric-vishria-benchmark" },
  { name: "Miles Grimshaw", firm: "Benchmark", title: "General Partner", slug: "miles-grimshaw-benchmark" },
  // Founders Fund
  { name: "Peter Thiel", firm: "Founders Fund", title: "Partner", slug: "peter-thiel-founders-fund" },
  { name: "Keith Rabois", firm: "Founders Fund", title: "Partner", slug: "keith-rabois-founders-fund" },
  { name: "Brian Singerman", firm: "Founders Fund", title: "Partner", slug: "brian-singerman-founders-fund" },
  { name: "Trae Stephens", firm: "Founders Fund", title: "Partner", slug: "trae-stephens-founders-fund" },
  { name: "Napoleon Ta", firm: "Founders Fund", title: "Partner", slug: "napoleon-ta-founders-fund" },
  // Kleiner Perkins
  { name: "John Doerr", firm: "Kleiner Perkins", title: "Partner", slug: "john-doerr-kleiner-perkins" },
  { name: "Mamoon Hamid", firm: "Kleiner Perkins", title: "Partner", slug: "mamoon-hamid-kleiner-perkins" },
  { name: "Ilya Fushman", firm: "Kleiner Perkins", title: "Partner", slug: "ilya-fushman-kleiner-perkins" },
  { name: "Bucky Moore", firm: "Kleiner Perkins", title: "Partner", slug: "bucky-moore-kleiner-perkins" },
  { name: "Monica Desai Weiss", firm: "Kleiner Perkins", title: "Partner", slug: "monica-desai-weiss-kleiner-perkins" },
  // General Catalyst
  { name: "Hemant Taneja", firm: "General Catalyst", title: "Managing Director", slug: "hemant-taneja-general-catalyst" },
  { name: "Joel Cutler", firm: "General Catalyst", title: "Managing Director", slug: "joel-cutler-general-catalyst" },
  { name: "Niko Bonatsos", firm: "General Catalyst", title: "Managing Director", slug: "niko-bonatsos-general-catalyst" },
  { name: "Deep Nishar", firm: "General Catalyst", title: "Managing Director", slug: "deep-nishar-general-catalyst" },
  { name: "Holly Maloney", firm: "General Catalyst", title: "Managing Director", slug: "holly-maloney-general-catalyst" },
  { name: "Quentin Clark", firm: "General Catalyst", title: "Managing Director", slug: "quentin-clark-general-catalyst" },
  // Lightspeed
  { name: "Jeremy Liew", firm: "Lightspeed Venture Partners", title: "Partner", slug: "jeremy-liew-lightspeed" },
  { name: "Ravi Mhatre", firm: "Lightspeed Venture Partners", title: "Partner", slug: "ravi-mhatre-lightspeed" },
  { name: "Will Kohler", firm: "Lightspeed Venture Partners", title: "Partner", slug: "will-kohler-lightspeed" },
  { name: "Gaurav Gupta", firm: "Lightspeed Venture Partners", title: "Partner", slug: "gaurav-gupta-lightspeed" },
  { name: "Amy Wu", firm: "Lightspeed Venture Partners", title: "Partner", slug: "amy-wu-lightspeed" },
  { name: "Mercedes Bent", firm: "Lightspeed Venture Partners", title: "Partner", slug: "mercedes-bent-lightspeed" },
  // Index Ventures
  { name: "Mike Volpi", firm: "Index Ventures", title: "Partner", slug: "mike-volpi-index" },
  { name: "Danny Rimer", firm: "Index Ventures", title: "Partner", slug: "danny-rimer-index" },
  { name: "Nina Achadjian", firm: "Index Ventures", title: "Partner", slug: "nina-achadjian-index" },
  { name: "Mark Goldberg", firm: "Index Ventures", title: "Partner", slug: "mark-goldberg-index" },
  { name: "Jan Hammer", firm: "Index Ventures", title: "Partner", slug: "jan-hammer-index" },
  // NEA
  { name: "Scott Sandell", firm: "NEA", title: "Managing General Partner", slug: "scott-sandell-nea" },
  { name: "Tony Florence", firm: "NEA", title: "General Partner", slug: "tony-florence-nea" },
  { name: "Mohamad Makhzoumi", firm: "NEA", title: "General Partner", slug: "mohamad-makhzoumi-nea" },
  { name: "Vanessa Larco", firm: "NEA", title: "Partner", slug: "vanessa-larco-nea" },
  { name: "Rick Yang", firm: "NEA", title: "General Partner", slug: "rick-yang-nea" },
  // Greylock
  { name: "Reid Hoffman", firm: "Greylock", title: "Partner", slug: "reid-hoffman-greylock" },
  { name: "Asheem Chandna", firm: "Greylock", title: "Partner", slug: "asheem-chandna-greylock" },
  { name: "Seth Rosenberg", firm: "Greylock", title: "Partner", slug: "seth-rosenberg-greylock" },
  { name: "David Thacker", firm: "Greylock", title: "Partner", slug: "david-thacker-greylock" },
  { name: "Saam Motamedi", firm: "Greylock", title: "Partner", slug: "saam-motamedi-greylock" },
  { name: "Glen Evans", firm: "Greylock", title: "Partner", slug: "glen-evans-greylock" },
  // Battery Ventures
  { name: "Neeraj Agrawal", firm: "Battery Ventures", title: "General Partner", slug: "neeraj-agrawal-battery" },
  { name: "Jesse Feldman", firm: "Battery Ventures", title: "General Partner", slug: "jesse-feldman-battery" },
  { name: "Chelsea Stoner", firm: "Battery Ventures", title: "General Partner", slug: "chelsea-stoner-battery" },
  { name: "Brandon Hull", firm: "Battery Ventures", title: "General Partner", slug: "brandon-hull-battery" },
  // Bessemer Venture Partners
  { name: "Byron Deeter", firm: "Bessemer Venture Partners", title: "Partner", slug: "byron-deeter-bessemer" },
  { name: "Adam Fisher", firm: "Bessemer Venture Partners", title: "Partner", slug: "adam-fisher-bessemer" },
  { name: "Ethan Kurzweil", firm: "Bessemer Venture Partners", title: "Partner", slug: "ethan-kurzweil-bessemer" },
  { name: "David Cowan", firm: "Bessemer Venture Partners", title: "Partner", slug: "david-cowan-bessemer" },
  { name: "Jeremy Levine", firm: "Bessemer Venture Partners", title: "Partner", slug: "jeremy-levine-bessemer" },
  { name: "Alex Ferrara", firm: "Bessemer Venture Partners", title: "Partner", slug: "alex-ferrara-bessemer" },
  // Redpoint Ventures
  { name: "Tomasz Tunguz", firm: "Redpoint Ventures", title: "General Partner", slug: "tomasz-tunguz-redpoint" },
  { name: "Satish Dharmaraj", firm: "Redpoint Ventures", title: "Partner", slug: "satish-dharmaraj-redpoint" },
  { name: "Scott Raney", firm: "Redpoint Ventures", title: "Partner", slug: "scott-raney-redpoint" },
  { name: "Logan Bartlett", firm: "Redpoint Ventures", title: "Managing Director", slug: "logan-bartlett-redpoint" },
  { name: "Annie Kadavy", firm: "Redpoint Ventures", title: "Partner", slug: "annie-kadavy-redpoint" },
  // IVP
  { name: "Jules Maltz", firm: "IVP", title: "General Partner", slug: "jules-maltz-ivp" },
  { name: "Eric Liaw", firm: "IVP", title: "General Partner", slug: "eric-liaw-ivp" },
  { name: "Somesh Dash", firm: "IVP", title: "General Partner", slug: "somesh-dash-ivp" },
  { name: "Tom Loverro", firm: "IVP", title: "General Partner", slug: "tom-loverro-ivp" },
  // Insight Partners
  { name: "Jeff Lieberman", firm: "Insight Partners", title: "Managing Director", slug: "jeff-lieberman-insight" },
  { name: "Deven Parekh", firm: "Insight Partners", title: "Managing Director", slug: "deven-parekh-insight" },
  { name: "Lonne Jaffe", firm: "Insight Partners", title: "Managing Director", slug: "lonne-jaffe-insight" },
  { name: "Hilary Gosher", firm: "Insight Partners", title: "Managing Director", slug: "hilary-gosher-insight" },
  // Tiger Global
  { name: "Chase Coleman", firm: "Tiger Global", title: "Managing Partner", slug: "chase-coleman-tiger-global" },
  { name: "Scott Shleifer", firm: "Tiger Global", title: "Partner", slug: "scott-shleifer-tiger-global" },
  { name: "Lee Fixel", firm: "Tiger Global", title: "Partner", slug: "lee-fixel-tiger-global" },
  // GV (Google Ventures)
  { name: "David Krane", firm: "GV", title: "Managing Partner", slug: "david-krane-gv" },
  { name: "Tyson Clark", firm: "GV", title: "General Partner", slug: "tyson-clark-gv" },
  { name: "Jessica Verrilli", firm: "GV", title: "General Partner", slug: "jessica-verrilli-gv" },
  { name: "MG Siegler", firm: "GV", title: "General Partner", slug: "mg-siegler-gv" },
  // Softbank Vision Fund
  { name: "Masayoshi Son", firm: "SoftBank Vision Fund", title: "Chairman & CEO", slug: "masayoshi-son-softbank" },
  { name: "Deep Nishar", firm: "SoftBank Vision Fund", title: "Senior Managing Partner", slug: "deep-nishar-softbank" },
  { name: "Lydia Jett", firm: "SoftBank Vision Fund", title: "Partner", slug: "lydia-jett-softbank" },
  // Coatue
  { name: "Philippe Laffont", firm: "Coatue Management", title: "Founder & Portfolio Manager", slug: "philippe-laffont-coatue" },
  { name: "Thomas Laffont", firm: "Coatue Management", title: "Partner", slug: "thomas-laffont-coatue" },
  { name: "Ariel Tseitlin", firm: "Coatue Management", title: "General Partner", slug: "ariel-tseitlin-coatue" },
  // First Round Capital
  { name: "Josh Kopelman", firm: "First Round Capital", title: "Partner", slug: "josh-kopelman-first-round" },
  { name: "Howard Morgan", firm: "First Round Capital", title: "Partner", slug: "howard-morgan-first-round" },
  { name: "Phin Barnes", firm: "First Round Capital", title: "Partner", slug: "phin-barnes-first-round" },
  { name: "Bill Trenchard", firm: "First Round Capital", title: "Partner", slug: "bill-trenchard-first-round" },
  { name: "Hayley Barna", firm: "First Round Capital", title: "Partner", slug: "hayley-barna-first-round" },
  { name: "Todd Jackson", firm: "First Round Capital", title: "Partner", slug: "todd-jackson-first-round" },
  // Union Square Ventures
  { name: "Fred Wilson", firm: "Union Square Ventures", title: "Managing Partner", slug: "fred-wilson-usv" },
  { name: "Albert Wenger", firm: "Union Square Ventures", title: "Managing Partner", slug: "albert-wenger-usv" },
  { name: "Andy Weissman", firm: "Union Square Ventures", title: "Managing Partner", slug: "andy-weissman-usv" },
  { name: "Rebecca Kaden", firm: "Union Square Ventures", title: "Managing Partner", slug: "rebecca-kaden-usv" },
  // Spark Capital
  { name: "Bijan Sabet", firm: "Spark Capital", title: "General Partner", slug: "bijan-sabet-spark" },
  { name: "Santo Politi", firm: "Spark Capital", title: "General Partner", slug: "santo-politi-spark" },
  { name: "Nabeel Hyatt", firm: "Spark Capital", title: "General Partner", slug: "nabeel-hyatt-spark" },
  { name: "Kevin Thau", firm: "Spark Capital", title: "General Partner", slug: "kevin-thau-spark" },
  // Khosla Ventures
  { name: "Vinod Khosla", firm: "Khosla Ventures", title: "Founder", slug: "vinod-khosla-khosla" },
  { name: "Sven Strohband", firm: "Khosla Ventures", title: "Partner", slug: "sven-strohband-khosla" },
  { name: "Samir Kaul", firm: "Khosla Ventures", title: "Partner", slug: "samir-kaul-khosla" },
  { name: "Keith Rabois", firm: "Khosla Ventures", title: "Partner", slug: "keith-rabois-khosla" },
  // Social Capital
  { name: "Chamath Palihapitiya", firm: "Social Capital", title: "Founder & CEO", slug: "chamath-palihapitiya-social-capital" },
  // Y Combinator
  { name: "Paul Graham", firm: "Y Combinator", title: "Partner", slug: "paul-graham-yc" },
  { name: "Sam Altman", firm: "Y Combinator", title: "Partner", slug: "sam-altman-yc" },
  { name: "Garry Tan", firm: "Y Combinator", title: "President & CEO", slug: "garry-tan-yc" },
  { name: "Jared Friedman", firm: "Y Combinator", title: "Partner", slug: "jared-friedman-yc" },
  { name: "Tom Blomfield", firm: "Y Combinator", title: "Partner", slug: "tom-blomfield-yc" },
  { name: "Nicolas Dessaigne", firm: "Y Combinator", title: "Partner", slug: "nicolas-dessaigne-yc" },
  { name: "Diana Hu", firm: "Y Combinator", title: "Partner", slug: "diana-hu-yc" },
  { name: "Michael Seibel", firm: "Y Combinator", title: "Partner", slug: "michael-seibel-yc" },
  { name: "Dalton Caldwell", firm: "Y Combinator", title: "Partner", slug: "dalton-caldwell-yc" },
  // Andreessen Horowitz additional
  { name: "Alex Rampell", firm: "Andreessen Horowitz", title: "General Partner", slug: "alex-rampell-a16z" },
  { name: "Kristina Shen", firm: "Andreessen Horowitz", title: "General Partner", slug: "kristina-shen-a16z" },
  { name: "Sarah Wang", firm: "Andreessen Horowitz", title: "General Partner", slug: "sarah-wang-a16z" },
  { name: "Anish Acharya", firm: "Andreessen Horowitz", title: "General Partner", slug: "anish-acharya-a16z" },
  // Initialized Capital
  { name: "Garry Tan", firm: "Initialized Capital", title: "Co-founder & Partner", slug: "garry-tan-initialized" },
  { name: "Alexis Ohanian", firm: "Initialized Capital", title: "Co-founder & Partner", slug: "alexis-ohanian-initialized" },
  { name: "Kim-Mai Cutler", firm: "Initialized Capital", title: "Partner", slug: "kim-mai-cutler-initialized" },
  // Matrix Partners
  { name: "David Skok", firm: "Matrix Partners", title: "General Partner", slug: "david-skok-matrix" },
  { name: "Josh Hannah", firm: "Matrix Partners", title: "General Partner", slug: "josh-hannah-matrix" },
  { name: "Patrick Malatack", firm: "Matrix Partners", title: "General Partner", slug: "patrick-malatack-matrix" },
  // True Ventures
  { name: "Tony Conrad", firm: "True Ventures", title: "Co-founder & Partner", slug: "tony-conrad-true" },
  { name: "Phil Black", firm: "True Ventures", title: "Co-founder & Partner", slug: "phil-black-true" },
  { name: "Jon Callaghan", firm: "True Ventures", title: "Co-founder & Partner", slug: "jon-callaghan-true" },
  { name: "Rohini Pandhi", firm: "True Ventures", title: "Partner", slug: "rohini-pandhi-true" },
  // Lowercase Capital
  { name: "Chris Sacca", firm: "Lowercase Capital", title: "Founder", slug: "chris-sacca-lowercase" },
  // KPCB / Kleiner Perkins additional
  { name: "Mary Meeker", firm: "Bond Capital", title: "Partner", slug: "mary-meeker-bond" },
  // Emergence Capital
  { name: "Jason Green", firm: "Emergence Capital", title: "Co-founder & General Partner", slug: "jason-green-emergence" },
  { name: "Jake Saper", firm: "Emergence Capital", title: "General Partner", slug: "jake-saper-emergence" },
  { name: "Santi Subotovsky", firm: "Emergence Capital", title: "General Partner", slug: "santi-subotovsky-emergence" },
  // Scale Venture Partners
  { name: "Rory O'Driscoll", firm: "Scale Venture Partners", title: "Partner", slug: "rory-odriscoll-scale" },
  { name: "Andy Vitus", firm: "Scale Venture Partners", title: "Partner", slug: "andy-vitus-scale" },
  // Andreessen Horowitz Bio
  { name: "Jorge Conde", firm: "Andreessen Horowitz", title: "General Partner", slug: "jorge-conde-a16z" },
  // Flatiron Health / Union Square
  { name: "Bryce Roberts", firm: "OATV", title: "Co-founder & Partner", slug: "bryce-roberts-oatv" },
  // Felicis Ventures
  { name: "Aydin Senkut", firm: "Felicis Ventures", title: "Founder & Managing Partner", slug: "aydin-senkut-felicis" },
  { name: "Viviana Faga", firm: "Felicis Ventures", title: "General Partner", slug: "viviana-faga-felicis" },
  // Cowboy Ventures
  { name: "Aileen Lee", firm: "Cowboy Ventures", title: "Founder & Partner", slug: "aileen-lee-cowboy" },
  { name: "Ted Wang", firm: "Cowboy Ventures", title: "Partner", slug: "ted-wang-cowboy" },
  // Forerunner Ventures
  { name: "Kirsten Green", firm: "Forerunner Ventures", title: "Founder & Managing Partner", slug: "kirsten-green-forerunner" },
  { name: "Eurie Kim", firm: "Forerunner Ventures", title: "Managing Partner", slug: "eurie-kim-forerunner" },
  // Canvas Ventures
  { name: "Rebecca Lynn", firm: "Canvas Ventures", title: "Co-founder & General Partner", slug: "rebecca-lynn-canvas" },
  { name: "Gary Little", firm: "Canvas Ventures", title: "Co-founder & General Partner", slug: "gary-little-canvas" },
  // Meritech Capital
  { name: "Paul Madera", firm: "Meritech Capital", title: "Managing Director", slug: "paul-madera-meritech" },
  { name: "George Bischof", firm: "Meritech Capital", title: "Managing Director", slug: "george-bischof-meritech" },
  // Norwest Venture Partners
  { name: "Jeff Crowe", firm: "Norwest Venture Partners", title: "Managing Partner", slug: "jeff-crowe-norwest" },
  { name: "Jon Kossow", firm: "Norwest Venture Partners", title: "Managing Partner", slug: "jon-kossow-norwest" },
  { name: "Promod Haque", firm: "Norwest Venture Partners", title: "Managing Partner", slug: "promod-haque-norwest" },
  // Excel Venture Management
  { name: "David Hornik", firm: "August Capital", title: "Partner", slug: "david-hornik-august" },
  // Lux Capital
  { name: "Josh Wolfe", firm: "Lux Capital", title: "Co-founder & Managing Partner", slug: "josh-wolfe-lux" },
  { name: "Peter Hebert", firm: "Lux Capital", title: "Co-founder & Managing Partner", slug: "peter-hebert-lux" },
  { name: "Adam Goulburn", firm: "Lux Capital", title: "Partner", slug: "adam-goulburn-lux" },
  // Founders Circle Capital
  { name: "Chris Albinson", firm: "Founders Circle Capital", title: "Managing Director", slug: "chris-albinson-founders-circle" },
  // Point Nine Capital
  { name: "Christoph Janz", firm: "Point Nine Capital", title: "Managing Partner", slug: "christoph-janz-point-nine" },
  { name: "Pawel Chudzinski", firm: "Point Nine Capital", title: "Managing Partner", slug: "pawel-chudzinski-point-nine" },
  // Balderton Capital
  { name: "Suranga Chandratillake", firm: "Balderton Capital", title: "General Partner", slug: "suranga-chandratillake-balderton" },
  { name: "James Wise", firm: "Balderton Capital", title: "Partner", slug: "james-wise-balderton" },
  { name: "Daniel Waterhouse", firm: "Balderton Capital", title: "General Partner", slug: "daniel-waterhouse-balderton" },
  // Atomico
  { name: "Niklas Zennström", firm: "Atomico", title: "Founder & Managing Partner", slug: "niklas-zennstrom-atomico" },
  { name: "Silas Adekunle", firm: "Atomico", title: "Partner", slug: "silas-adekunle-atomico" },
  // Accel Europe
  { name: "Sonali De Rycker", firm: "Accel", title: "Partner", slug: "sonali-de-rycker-accel" },
  { name: "Harry Nelis", firm: "Accel", title: "Partner", slug: "harry-nelis-accel" },
  // Advent International
  { name: "David Mussafer", firm: "Advent International", title: "Managing Partner", slug: "david-mussafer-advent" },
  // DST Global
  { name: "Yuri Milner", firm: "DST Global", title: "Founder & Managing Partner", slug: "yuri-milner-dst" },
  // General Atlantic
  { name: "Bill Ford", firm: "General Atlantic", title: "CEO & Managing Director", slug: "bill-ford-general-atlantic" },
  { name: "Martina Hund-Mejean", firm: "General Atlantic", title: "Managing Director", slug: "martina-hund-mejean-ga" },
  // Owl Rock / Blue Owl
  { name: "Doug Ostrover", firm: "Blue Owl Capital", title: "Co-CEO", slug: "doug-ostrover-blue-owl" },
  // Craft Ventures
  { name: "David Sacks", firm: "Craft Ventures", title: "Co-founder & General Partner", slug: "david-sacks-craft" },
  { name: "Bill Lee", firm: "Craft Ventures", title: "Co-founder & General Partner", slug: "bill-lee-craft" },
  // Village Global
  { name: "Erik Torenberg", firm: "Village Global", title: "Co-founder & Partner", slug: "erik-torenberg-village-global" },
  // Long Journey Ventures
  { name: "Astasia Myers", firm: "Quiet Capital", title: "Partner", slug: "astasia-myers-quiet" },
  // Lerer Hippeau
  { name: "Eric Hippeau", firm: "Lerer Hippeau", title: "Managing Partner", slug: "eric-hippeau-lh" },
  { name: "Ben Lerer", firm: "Lerer Hippeau", title: "Managing Partner", slug: "ben-lerer-lh" },
  // Slow Ventures
  { name: "Sam Lessin", firm: "Slow Ventures", title: "Managing Partner", slug: "sam-lessin-slow" },
  // Box Group
  { name: "David Tisch", firm: "BoxGroup", title: "Managing Partner", slug: "david-tisch-boxgroup" },
  { name: "Adam Rothenberg", firm: "BoxGroup", title: "Managing Partner", slug: "adam-rothenberg-boxgroup" },
  // Homebrew
  { name: "Hunter Walk", firm: "Homebrew", title: "Partner", slug: "hunter-walk-homebrew" },
  { name: "Satya Patel", firm: "Homebrew", title: "Partner", slug: "satya-patel-homebrew" },
  // Floodgate
  { name: "Mike Maples Jr.", firm: "Floodgate", title: "Managing Partner", slug: "mike-maples-floodgate" },
  { name: "Ann Miura-Ko", firm: "Floodgate", title: "Managing Partner", slug: "ann-miura-ko-floodgate" },
  // CRV
  { name: "Reid Christian", firm: "CRV", title: "General Partner", slug: "reid-christian-crv" },
  { name: "Murat Bicer", firm: "CRV", title: "General Partner", slug: "murat-bicer-crv" },
  { name: "Justine Moore", firm: "CRV", title: "Partner", slug: "justine-moore-crv" },
  // Venrock
  { name: "David Pakman", firm: "Venrock", title: "Partner", slug: "david-pakman-venrock" },
  { name: "Bryan Roberts", firm: "Venrock", title: "Partner", slug: "bryan-roberts-venrock" },
  // Shasta Ventures
  { name: "Jacob Mullins", firm: "Shasta Ventures", title: "Partner", slug: "jacob-mullins-shasta" },
  { name: "Nitin Chopra", firm: "Shasta Ventures", title: "General Partner", slug: "nitin-chopra-shasta" },
  // Tusk Ventures
  { name: "Bradley Tusk", firm: "Tusk Ventures", title: "Founder & Managing Partner", slug: "bradley-tusk-tusk" },
  // SignalFire
  { name: "Chris Farmer", firm: "SignalFire", title: "CEO & General Partner", slug: "chris-farmer-signalfire" },
  // Greenoaks Capital
  { name: "Neil Mehta", firm: "Greenoaks Capital", title: "Founding Partner", slug: "neil-mehta-greenoaks" },
  // QED Investors
  { name: "Frank Rotman", firm: "QED Investors", title: "Co-founder & Partner", slug: "frank-rotman-qed" },
  { name: "Nigel Morris", firm: "QED Investors", title: "Co-founder & Managing Partner", slug: "nigel-morris-qed" },
  // Bain Capital Ventures
  { name: "Salil Deshpande", firm: "Bain Capital Ventures", title: "Managing Director", slug: "salil-deshpande-bain-capital" },
  { name: "Enrique Salem", firm: "Bain Capital Ventures", title: "Managing Director", slug: "enrique-salem-bain-capital" },
  { name: "Scott Friend", firm: "Bain Capital Ventures", title: "Managing Director", slug: "scott-friend-bain-capital" },
  // Francisco Partners
  { name: "David Golob", firm: "Francisco Partners", title: "Partner", slug: "david-golob-francisco" },
  // Vista Equity Partners
  { name: "Robert Smith", firm: "Vista Equity Partners", title: "Founder & CEO", slug: "robert-smith-vista" },
  // Thrive Capital
  { name: "Josh Kushner", firm: "Thrive Capital", title: "Founder & Managing Partner", slug: "josh-kushner-thrive" },
  { name: "Kareem Zaki", firm: "Thrive Capital", title: "Partner", slug: "kareem-zaki-thrive" },
  // Ribbit Capital
  { name: "Meyer Malka", firm: "Ribbit Capital", title: "Founder & Partner", slug: "meyer-malka-ribbit" },
  { name: "Nick Shalek", firm: "Ribbit Capital", title: "Partner", slug: "nick-shalek-ribbit" },
  // Andreessen Horowitz crypto
  { name: "Ali Yahya", firm: "Andreessen Horowitz", title: "General Partner", slug: "ali-yahya-a16z" },
  // Greycroft
  { name: "Alan Patricof", firm: "Greycroft", title: "Co-founder & Managing Director", slug: "alan-patricof-greycroft" },
  { name: "Dana Settle", firm: "Greycroft", title: "Partner", slug: "dana-settle-greycroft" },
  { name: "Ian Sigalow", firm: "Greycroft", title: "Partner", slug: "ian-sigalow-greycroft" },
  // NextView Ventures
  { name: "Rob Go", firm: "NextView Ventures", title: "Co-founder & Partner", slug: "rob-go-nextview" },
  { name: "Lee Hower", firm: "NextView Ventures", title: "Co-founder & Partner", slug: "lee-hower-nextview" },
  // Canaan Partners
  { name: "Hrach Simonian", firm: "Canaan Partners", title: "General Partner", slug: "hrach-simonian-canaan" },
  { name: "Maha Ibrahim", firm: "Canaan Partners", title: "General Partner", slug: "maha-ibrahim-canaan" },
  // SV Angel
  { name: "Ron Conway", firm: "SV Angel", title: "Founder", slug: "ron-conway-sv-angel" },
  { name: "David Lee", firm: "SV Angel", title: "Managing Partner", slug: "david-lee-sv-angel" },
  // Andreessen Horowitz growth
  { name: "David George", firm: "Andreessen Horowitz", title: "General Partner", slug: "david-george-a16z" },
  // Sequoia Scout
  { name: "Jess Lee", firm: "Sequoia Capital", title: "Partner", slug: "jess-lee-sequoia" },
  // a16z additional
  { name: "Frank Chen", firm: "Andreessen Horowitz", title: "Partner", slug: "frank-chen-a16z" },
  // Coatue additional
  { name: "Matthew Mazzeo", firm: "Coatue Management", title: "Partner", slug: "matthew-mazzeo-coatue" },
  // OpenAI Fund
  { name: "Zico Kolter", firm: "OpenAI", title: "Partner", slug: "zico-kolter-openai" },
  // Innovation Endeavors
  { name: "Eric Schmidt", firm: "Innovation Endeavors", title: "Co-founder & Partner", slug: "eric-schmidt-innovation" },
  { name: "Dror Berman", firm: "Innovation Endeavors", title: "Co-founder & Managing Partner", slug: "dror-berman-innovation" },
  // Variant
  { name: "Jesse Walden", firm: "Variant", title: "Founder & Managing Partner", slug: "jesse-walden-variant" },
  { name: "Li Jin", firm: "Atelier Ventures", title: "Founder & Partner", slug: "li-jin-atelier" },
  // Spark Capital additional
  { name: "Alex Finkelstein", firm: "Spark Capital", title: "General Partner", slug: "alex-finkelstein-spark" },
  // Sequoia India
  { name: "Rajan Anandan", firm: "Sequoia Capital India", title: "Managing Director", slug: "rajan-anandan-sequoia-india" },
  { name: "Shailesh Lakhani", firm: "Sequoia Capital India", title: "Managing Director", slug: "shailesh-lakhani-sequoia-india" },
  // Peak XV (formerly Sequoia India)
  { name: "GV Ravishankar", firm: "Peak XV Partners", title: "Managing Director", slug: "gv-ravishankar-peak-xv" },
  // Accel India
  { name: "Prashanth Prakash", firm: "Accel India", title: "Partner", slug: "prashanth-prakash-accel-india" },
  { name: "Shekhar Kirani", firm: "Accel India", title: "Partner", slug: "shekhar-kirani-accel-india" },
  { name: "Anand Daniel", firm: "Accel India", title: "Partner", slug: "anand-daniel-accel-india" },
  // Matrix Partners India
  { name: "Avnish Bajaj", firm: "Matrix Partners India", title: "Co-founder & Managing Director", slug: "avnish-bajaj-matrix-india" },
  // Lightspeed India
  { name: "Hemant Mohapatra", firm: "Lightspeed India", title: "Partner", slug: "hemant-mohapatra-lightspeed-india" },
  { name: "Harsha Kumar", firm: "Lightspeed India", title: "Partner", slug: "harsha-kumar-lightspeed-india" },
  // Nexus Venture Partners
  { name: "Naren Gupta", firm: "Nexus Venture Partners", title: "Co-founder & Managing Director", slug: "naren-gupta-nexus" },
  { name: "Jishnu Bhattacharjee", firm: "Nexus Venture Partners", title: "Managing Director", slug: "jishnu-bhattacharjee-nexus" },
  // Kalaari Capital
  { name: "Vani Kola", firm: "Kalaari Capital", title: "Managing Director", slug: "vani-kola-kalaari" },
  // Bessemer additional
  { name: "Tomer Diari", firm: "Bessemer Venture Partners", title: "Partner", slug: "tomer-diari-bessemer" },
  // Spark Capital additional
  { name: "Andrew Parker", firm: "Spark Capital", title: "General Partner", slug: "andrew-parker-spark" },
  // Brainchild / Precursor
  { name: "Charles Hudson", firm: "Precursor Ventures", title: "Managing Partner", slug: "charles-hudson-precursor" },
  // Pear VC
  { name: "Pejman Nozad", firm: "Pear VC", title: "Co-founder & Managing Partner", slug: "pejman-nozad-pear" },
  { name: "Mar Hershenson", firm: "Pear VC", title: "Co-founder & Managing Partner", slug: "mar-hershenson-pear" },
  // Andreessen Horowitz infrastructure
  { name: "Jay Simons", firm: "Andreessen Horowitz", title: "General Partner", slug: "jay-simons-a16z" },
  // Sequoia additional
  { name: "Sonya Huang", firm: "Sequoia Capital", title: "Partner", slug: "sonya-huang-sequoia" },
  { name: "Luciana Lixandru", firm: "Sequoia Capital", title: "Partner", slug: "luciana-lixandru-sequoia" },
  // Bessemer additional
  { name: "Kent Bennett", firm: "Bessemer Venture Partners", title: "Partner", slug: "kent-bennett-bessemer" },
  // Accel additional
  { name: "Andrew Braccia", firm: "Accel", title: "Partner", slug: "andrew-braccia-accel" },
  // Lightspeed additional
  { name: "Nicole Quinn", firm: "Lightspeed Venture Partners", title: "Partner", slug: "nicole-quinn-lightspeed" },
  // Neo
  { name: "Ali Partovi", firm: "Neo", title: "Co-founder & CEO", slug: "ali-partovi-neo" },
  // Contrary Capital
  { name: "Eric Tarczynski", firm: "Contrary Capital", title: "Founder & Managing Partner", slug: "eric-tarczynski-contrary" },
  // 8VC
  { name: "Joe Lonsdale", firm: "8VC", title: "Co-founder & Managing Partner", slug: "joe-lonsdale-8vc" },
  // Menlo Ventures
  { name: "Shawn Carolan", firm: "Menlo Ventures", title: "Partner", slug: "shawn-carolan-menlo" },
  { name: "Matt Murphy", firm: "Menlo Ventures", title: "Managing Director", slug: "matt-murphy-menlo" },
  // Summit Partners
  { name: "Peter Chung", firm: "Summit Partners", title: "Managing Director", slug: "peter-chung-summit" },
  // Andreessen Horowitz games
  { name: "Jonathan Lai", firm: "Andreessen Horowitz", title: "Partner", slug: "jonathan-lai-a16z" },
  // Sequoia additional
  { name: "Carl Eschenbach", firm: "Sequoia Capital", title: "Partner", slug: "carl-eschenbach-sequoia" },
  // Tiger Global additional
  { name: "John Curtius", firm: "Tiger Global", title: "Partner", slug: "john-curtius-tiger-global" },
  // General Catalyst additional
  { name: "Steve Herrod", firm: "General Catalyst", title: "Managing Director", slug: "steve-herrod-general-catalyst" },
  { name: "Eli Gill", firm: "General Catalyst", title: "Managing Director", slug: "eli-gill-general-catalyst" },
  // Accel additional
  { name: "Ethan Choi", firm: "Accel", title: "Partner", slug: "ethan-choi-accel" },
  // Excel Venture Management
  { name: "Jim Barnett", firm: "Excel Venture Management", title: "Managing Director", slug: "jim-barnett-excel" },
  // GV additional
  { name: "Karim Faris", firm: "GV", title: "General Partner", slug: "karim-faris-gv" },
  // Lightspeed additional
  { name: "Arif Janmohamed", firm: "Lightspeed Venture Partners", title: "Partner", slug: "arif-janmohamed-lightspeed" },
  // Accel additional
  { name: "Seth Rosenberg", firm: "Accel", title: "Partner", slug: "seth-rosenberg-accel" },
  // Andreessen Horowitz clinical
  { name: "Vineeta Agarwala", firm: "Andreessen Horowitz", title: "General Partner", slug: "vineeta-agarwala-a16z" },
  // a16z additional
  { name: "Stacy Brown-Philpot", firm: "Andreessen Horowitz", title: "General Partner", slug: "stacy-brown-philpot-a16z" },
  // Sequoia additional
  { name: "Mike Vernal", firm: "Sequoia Capital", title: "Partner", slug: "mike-vernal-sequoia" },
  // First Round additional
  { name: "Chris Fralic", firm: "First Round Capital", title: "Partner", slug: "chris-fralic-first-round" },
  // Redpoint additional
  { name: "Alex Bard", firm: "Redpoint Ventures", title: "Partner", slug: "alex-bard-redpoint" },
  // Benchmark additional
  { name: "Robert Goldberg", firm: "Benchmark", title: "General Partner", slug: "robert-goldberg-benchmark" },
  // Andreessen Horowitz american dynamism
  { name: "Katherine Boyle", firm: "Andreessen Horowitz", title: "General Partner", slug: "katherine-boyle-a16z" },
  { name: "David Ulevitch", firm: "Andreessen Horowitz", title: "General Partner", slug: "david-ulevitch-a16z" },
  // Lightspeed additional
  { name: "Alex Taussig", firm: "Lightspeed Venture Partners", title: "Partner", slug: "alex-taussig-lightspeed" },
  // Intel Capital
  { name: "Mark Rostick", firm: "Intel Capital", title: "Vice President", slug: "mark-rostick-intel-capital" },
  // Salesforce Ventures
  { name: "Paul Drews", firm: "Salesforce Ventures", title: "Managing Partner", slug: "paul-drews-salesforce-ventures" },
  // Sequoia additional
  { name: "Juliet de Baubigny", firm: "Sequoia Capital", title: "Partner", slug: "juliet-de-baubigny-sequoia" },
  // Index additional
  { name: "Shardul Shah", firm: "Index Ventures", title: "Partner", slug: "shardul-shah-index" },
  // Andreessen Horowitz additional
  { name: "Bob Swan", firm: "Andreessen Horowitz", title: "General Partner", slug: "bob-swan-a16z" },
  // Sequoia Capital additional
  { name: "Matthew Miller", firm: "Sequoia Capital", title: "Partner", slug: "matthew-miller-sequoia" },
  // Index Ventures additional
  { name: "Saul Klein", firm: "LocalGlobe", title: "Co-founder & Partner", slug: "saul-klein-localglobe" },
  // GP Bull Frog
  { name: "Mike Ghaffary", firm: "Canvas Ventures", title: "General Partner", slug: "mike-ghaffary-canvas" },
  // Headline
  { name: "Johannes Lenhard", firm: "Headline", title: "Partner", slug: "johannes-lenhard-headline" },
  // Village Global additional
  { name: "Ben Casnocha", firm: "Village Global", title: "Co-founder & CEO", slug: "ben-casnocha-village-global" },
  // Insight additional
  { name: "Richard Wells", firm: "Insight Partners", title: "Managing Director", slug: "richard-wells-insight" },
  // Greylock additional
  { name: "Jerry Chen", firm: "Greylock", title: "Partner", slug: "jerry-chen-greylock" },
  { name: "Sarah Guo", firm: "Conviction", title: "Founder & Managing Partner", slug: "sarah-guo-conviction" },
  // Unusual Ventures
  { name: "John Vrionis", firm: "Unusual Ventures", title: "Co-founder & Partner", slug: "john-vrionis-unusual" },
  { name: "Jyoti Bansal", firm: "Unusual Ventures", title: "Co-founder & Partner", slug: "jyoti-bansal-unusual" },
  // New Enterprise Associates (NEA) additional
  { name: "Luke Pappas", firm: "NEA", title: "General Partner", slug: "luke-pappas-nea" },
  // Andreessen Horowitz additional
  { name: "Sam Wholley", firm: "Andreessen Horowitz", title: "Partner", slug: "sam-wholley-a16z" },
  // GGV Capital
  { name: "Jeff Richards", firm: "Notable Capital", title: "Managing Partner", slug: "jeff-richards-notable" },
  { name: "Hans Tung", firm: "Notable Capital", title: "Managing Partner", slug: "hans-tung-notable" },
  // Sequoia additional
  { name: "George Robson", firm: "Sequoia Capital", title: "Partner", slug: "george-robson-sequoia" },
  // Lightspeed additional
  { name: "Semil Shah", firm: "Haystack", title: "Founder & General Partner", slug: "semil-shah-haystack" },
  // Addition
  { name: "Lee Fixel", firm: "Addition", title: "Founder & Partner", slug: "lee-fixel-addition" },
  // Founders Fund additional
  { name: "Delian Asparouhov", firm: "Founders Fund", title: "Partner", slug: "delian-asparouhov-founders-fund" },
  // OpenView
  { name: "Scott Maxwell", firm: "OpenView", title: "Founder & Managing Partner", slug: "scott-maxwell-openview" },
  { name: "Kyle Poyar", firm: "OpenView", title: "Partner", slug: "kyle-poyar-openview" },
  // Accel additional
  { name: "Jake Saper", firm: "Accel", title: "Partner", slug: "jake-saper-accel" },
  // GV additional
  { name: "Dave Munichiello", firm: "GV", title: "General Partner", slug: "dave-munichiello-gv" },
  // Greylock additional
  { name: "Reid Hoffman", firm: "Greylock", title: "Partner", slug: "reid-hoffman-greylock-2" },
  // a16z additional
  { name: "Olivia Moore", firm: "Andreessen Horowitz", title: "Partner", slug: "olivia-moore-a16z" },
  { name: "Zane Lackey", firm: "Andreessen Horowitz", title: "Partner", slug: "zane-lackey-a16z" },
  // Sequoia additional
  { name: "Shaun Maguire", firm: "Sequoia Capital", title: "Partner", slug: "shaun-maguire-sequoia-2" },
  // Bessemer additional
  { name: "Mary D'Onofrio", firm: "Bessemer Venture Partners", title: "Partner", slug: "mary-donofrio-bessemer" },
  // NEA additional
  { name: "Carmen Chang", firm: "NEA", title: "General Partner", slug: "carmen-chang-nea" },
  // Lowercase additional
  { name: "Matt Mazzeo", firm: "Lowercase Capital", title: "Partner", slug: "matt-mazzeo-lowercase" },
  // a16z additional
  { name: "Carra Wu", firm: "Andreessen Horowitz", title: "Partner", slug: "carra-wu-a16z" },
  // Norwest additional
  { name: "Scott Beechuk", firm: "Norwest Venture Partners", title: "Partner", slug: "scott-beechuk-norwest" },
  // Accel additional
  { name: "Ryan Sweeney", firm: "Accel", title: "Partner", slug: "ryan-sweeney-accel" },
  // General Catalyst additional
  { name: "Josh Kushner", firm: "General Catalyst", title: "Partner", slug: "josh-kushner-gc" },
  // Lightspeed additional
  { name: "Hemant Mohapatra", firm: "Lightspeed Venture Partners", title: "Partner", slug: "hemant-mohapatra-lightspeed" },
  // Data Collective (DCVC)
  { name: "Matt Ocko", firm: "DCVC", title: "Co-managing Partner", slug: "matt-ocko-dcvc" },
  { name: "Zachary Bogue", firm: "DCVC", title: "Co-managing Partner", slug: "zachary-bogue-dcvc" },
];
