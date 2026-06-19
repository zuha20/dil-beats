/*
  ====================================================================
  EDIT THIS FILE TO ADD YOUR SONGS — 3 CATEGORIES, 10 SONGS EACH
  ====================================================================

  Your playlist is now organized into three mood categories:
  rock, sad, and romantic. Each one is its own list below.

  1. Put your mp3 files inside the "songs" folder.
  2. Put album art images inside the "covers" folder.
  3. For each song, fill in one object exactly like the example —
     just copy/paste the format and change the details.

  file   -> exact filename inside the songs folder
  cover  -> exact filename inside the covers folder
            (or leave as "covers/placeholder.jpg")
  title  -> song name shown in the UI
  artist -> artist name shown in the UI

  Duration is read automatically — you don't need to fill it in.

  TIP: avoid spaces in filenames. Use hyphens or underscores instead
  (good: "tum-hi-ho.mp3"  |  risky: "Tum Hi Ho.mp3")
  ====================================================================
*/

const songCategories = [
  {
    id: "rock",
    label: "Rock",
    tagline: "Loud, fast, no apologies",
    accent: "#F08FB0",
  songs: [
      { file: "songs/rock7.mp3", cover: "covers/rock2.png", title: "Galat Baat hai", artist: "Arijit Singh" },
      { file: "songs/rock5.mp3", cover: "covers/rock5.png", title: "Daaru Badnam", artist: "Param Singh" },
      { file: "songs/rock6.mp3", cover: "covers/rock6.png", title: "Nashe se Chad gyi", artist: "Arijit Singh" },
      { file: "songs/rock8.mp3", cover: "covers/rock8.png", title: "AnarKali", artist: "Mamta Sharma" },
      { file: "songs/rock9.mp3", cover: "covers/rock9.png", title: "Fevicol se", artist: "Mamta Sharma" },
      { file: "songs/rock10.mp3", cover: "covers/rock10.png", title: "Muni Badnaam", artist: "Mamta Sharma" },
      { file: "songs/rock11.mp3", cover: "covers/rock11.png", title: "Boom Diggy Boom Boom", artist: "jasmin waliya" },
      { file: "songs/rock12.mp3", cover: "covers/rock12.png", title: "Dilbar Dilbar", artist: "Neha Kakkar" },
      { file: "songs/rock1.mp3", cover: "covers/rock1.png", title: "Nacha ge saari raat", artist: "Arijit Singh" },
      { file: "songs/rock2.mp3", cover: "covers/rock2.png", title: "Me tera Hero", artist: "Arijit Singh" },
      { file: "songs/rock3.mp3", cover: "covers/rock3.png", title: "Party all night", artist: "yo yo Honey Singh" },
      { file: "songs/rock4.mp3", cover: "covers/rock4.png", title: "Badtameez dil", artist: "Arijit Singh" },
      
       
      { file: "songs/rock13.mp3", cover: "covers/rock13.png", title: "Twist", artist: "Neeraj Shridhar" }

      
      
    ]
  },
  {
    id: "sad",
    label: "Sad",
    tagline: "For the quiet, heavy days",
    accent: "#C97B98",
    songs: [
      { file: "songs/sad1.mp3", cover: "covers/sad1.png", title: "Udaariyaan", artist: "Sartinder Sartaaj" },
      { file: "songs/sad2.mp3", cover: "covers/sad2.png", title: "Ik Mulakaat", artist: "Arushmaan khurana" },
      { file: "songs/sad3.mp3", cover: "covers/sad3.png", title: "Hayee Mera Dil", artist: "YO YO Honey Singh" },
      { file: "songs/sad4.mp3", cover: "covers/sad4.png", title: "Ham bhool gye", artist: "Sawaan Kumar" },
      { file: "songs/sad5.mp3", cover: "covers/sad5.png", title: "Zarori Tha", artist: "Rahet Fateh Ali Khan" },
       
      { file: "songs/sad9.mp3", cover: "covers/sad9.png", title: "Tu hi Haqeeqat", artist: "Javed Ali" },
      { file: "songs/sad10.mp3", cover: "covers/sad10.png", title: "Bewafa", artist: "Imran Khan" },
      { file: "songs/sad11.mp3", cover: "covers/sad11.png", title: "Tum hi ho", artist: "Arjit Singh" },
      { file: "songs/sad12.mp3", cover: "covers/sad12.png", title: "Bekhayali"
, artist: "Sachet Tandon" },
      { file: "songs/sad13.mp3", cover: "covers/sad13.png", title: "Mann mera", artist: "Gajendra Verma" },
      { file: "songs/sad14.mp3", cover: "covers/sad14.png", title: "Dil Laggi", artist: "Rahet Fateh Ali Khan" },
      { file: "songs/sad15.mp3", cover: "covers/sad15.png", title: "Dil to Bacha hai", artist: "Rahet Fateh Ali Khan" },
      { file: "songs/sad16.mp3", cover: "covers/sad16.png", title: "Samjhawan", artist: "Arijit Singh, Shreya Ghoshal" },
      { file: "songs/sad17.mp3", cover: "covers/sad17.png", title: "Sochta Hoon", artist: "Nusrat Fateh Ali Khan" },
      { file: "songs/sad18.mp3", cover: "covers/sad18.png", title: "Ye tunay Kya Kiya", artist: "Javed Bashir" },
      { file: "songs/sad19.mp3", cover: "covers/sad19.png", title: "Dil pay Zakham", artist: "Nusrat Fateh Ali Khan" },
      { file: "songs/sad20.mp3", cover: "covers/sad20.png", title: "Bairan", artist: "Banjaare" },
      { file: "songs/sad21.mp3", cover: "covers/sad21.png", title: "Maula Mere Maula", artist: "Roopkumar Rathod" },
      { file: "songs/sad6.mp3", cover: "covers/sad6.png", title: "Do Pal", artist: "Lata Mangeshukar" },
      { file: "songs/sad7.mp3", cover: "covers/sad7.png", title: "Paar Chanade", artist: "Shilpa Rao" },
      { file: "songs/sad8.mp3", cover: "covers/sad8.png", title: "Tu jane na", artist: "Atif Aslam" }


    ]
  },
  {
    id: "romantic",
    label: "Romantic",
    tagline: "Soft songs for soft moments",
    accent: "#F2A6C2",
   songs: [
      { file: "songs/romantic1.mp3", cover: "covers/romantic1.png", title: "Duji vari pyar", artist: "Sunanda Sharma" },
      { file: "songs/romantic2.mp3", cover: "covers/romantic2.png", title: "Aj se teri", artist: "PadMan" },
      { file: "songs/romantic3.mp3", cover: "covers/romantic3.png", title: "Jeene laga hoon", artist: "Atif Aslam" },
      { file: "songs/romantic4.mp3", cover: "covers/romantic4.png", title: "Sheesha", artist: "Mitta Ror" },
      { file: "songs/romantic5.mp3", cover: "covers/romantic5.png", title: "Sajan Raazi", artist: "Sartinder Sartaaj" },
      { file: "songs/romantic6.mp3", cover: "covers/romantic6.png", title: "Fakira", artist: "sonam Puri" },
      { file: "songs/romantic7.mp3", cover: "covers/romantic7.png", title: "Sawar loon", artist: "Monali Thakur" },
    
      { file: "songs/romantic9.mp3", cover: "covers/romantic9.png", title: "Hua Aj Pehli baar", artist: "Armaan Malik" },
      { file: "songs/romantic10.mp3", cover: "covers/romantic10.png", title: "Finding Her", artist: "Bharat and Saheal" },
      { file: "songs/romantic11.mp3", cover: "covers/romantic12.png", title: "Ishq de Fanyar", artist: "Jyotica Tangri" }, 
      { file: "songs/romantic12.mp3", cover: "covers/romantic11.png", title: "Tere liye", artist: "Shreya Goshal and Atif Aslam" }, 
      { file: "songs/romantic13.mp3", cover: "covers/romantic13.png", title: "Bol na Halkay Halkay", artist: "rahat Fateh Ali Khan" }, 
      { file: "songs/romantic14.mp3", cover: "covers/romantic14.png", title: "Hangover", artist: "Meet Bros" },
      { file: "songs/romantic15.mp3", cover: "covers/romantic15.png", title: "Falak Tak", artist: "Udit Narayan" },
      { file: "songs/romantic16.mp3", cover: "covers/romantic16.png", title: "Tere Sang Yara", artist: "Atif Aslam" },
      { file: "songs/romantic17.mp3", cover: "covers/romantic17.png", title: "Jhol", artist: "Mannu, Annural Khalid" },
      { file: "songs/romantic18.mp3", cover: "covers/romantic18.png", title: "Achi lagti ho", artist: "Shankar-Ehsaan-Loy" },
      { file: "songs/romantic19.mp3", cover: "covers/romantic19.png", title: "Dagabaaz Re", artist: "Rahet Fateh Ali Khan , Shreya Goshal" },
      { file: "songs/romantic8.mp3", cover: "covers/romantic8.png", title: "Good Luck Charm", artist: "K.S Makhan" }
    ]
  }
];

// Flattened list — built automatically, the player code uses this internally.
// You don't need to touch this part.
const songs = songCategories.flatMap(cat => cat.songs.map(s => ({ ...s, categoryId: cat.id })));
