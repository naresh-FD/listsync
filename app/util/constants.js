export const defaultItems = [
  {
    uid:
      Date.now().toString() +
      Math.round(Math.random() * (99999999 - 10000000) + 10000000),
    title: "Carrot",
    description: "Rabbit Varient",
    favourite: false,
    category: "Grocery",
    author: "",
  },
  {
    uid:
      Date.now().toString() +
      Math.round(Math.random() * (99999999 - 10000000) + 30000000),
    title: "Tomato",
    description: "Apple Tomato",
    favourite: false,
    category: "Grocery",
    author: "",
  },
  {
    uid:
      Date.now().toString() +
      Math.round(Math.random() * (99999999 - 10000000) + 20000000),
    title: "Onion",
    description: "Egypt Onion",
    favourite: false,
    category: "Grocery",
    author: "",
  },
];

export const recommendedItems = [
  "Asparagus",
  "Brinjal",
  "Broccoli",
  "Carrot",
  "Beans",
  "Tomato",
  "Corn",
  "Capsicum",
  "Cucumber",
  "Drumstick",
  "Spinach",
  "Cabbage",
  "Onions",
  "Cauliflower",
  "Chilli",
  "Lemon",
  "Lime",
  "Ladies Finger",
  "Bitter gourd",
  "Pumpkin",
  "Ginger",
  "Garlic",
  "Radish",
  "Zucchini",
  "Chokes",
  "Green chilli",
  "Red chilli",
  "Kidney Beans",
  "Yam",
  "Beetroot",
  "Mushroom",
  "Spring onion",
  "Snow peas",
  "Coconut",
  "Coriander",
  "Mint",
  "Rockmelon",
  "Brussels Sprouts",
  "Sprouts",
  "Basil",
  "Apple",
  "Apricot",
  "Avocado",
  "Banana",
  "Mango",
  "Blueberry",
  "Blackberry",
  "Raspberry",
  "Strawberry",
  "Kiwi",
  "Papaya",
  "Cranberry",
  "Melon",
  "Clementine",
  "Cherries",
  "Plum",
  "Dates",
  "Gooseberry",
  "Jackfruit",
  "Lychee",
  "Mangosteen",
  "Nectarine",
  "Pomegranate",
  "Watermelon",
  "Amla",
  "Pineapple",
  "Peach",
  "Prunes",
  "Urad Dal",
  "Toor Dal",
  "Moong Dal",
  "Channa Dal",
  "Turmeric",
  "Salt",
  "Sugar",
  "Pepper",
  "Cumin seed",
  "Elachi",
  "Tamarind",
  "Masala",
  "Samosa",
  "Pickle",
  "Basmati Rice",
  "Wheat Flour",
  "Maida",
  "Flour",
  "Chips",
  "Prawns",
  "Squid",
  "Fish",
  "Chicken",
  "Lamb",
  "Goat",
  "Cashews",
  "Almond",
  "Walnut",
  "Peanuts",
  "Pine nuts",
  "Banana leaf",
  "Battery",
  "Phone charger",
  "Bulb",
  "Spoon",
  "Fork",
  "Tissue paper",
  "Napkin",
  "Serviette",
  "Knife",
  "Paper",
  "Scissors",
  "Pencil",
  "Pen",
  "Eraser",
  "Sharpner",
  "Tooth paste",
  "Soap",
  "Dishwashing liquid",
  "Laundry detergent",
  "Garbage bags",
  "Oil",
  "Olive Oil",
  "Chocolate",
  "Ice cream",
];

export const supportEmail = "todoList@gmail.com";

export const screenBgImage = require("../../assets/images/screenBg.png");
export const offerWallBgImage = require("../../assets/images/offerWallBg.png");
export const offerCardBg = require("../../assets/images/offerCardBg.png");
export const offerCardBgInActive = require("../../assets/images/offerCardInActiveBg.png");
export const backButtonImage = require("../../assets/icons/backLight.png");
export const formatImage = require("../../assets/icons/formatImageIcon.png");
export const cameraImage = require("../../assets/icons/cameraIcon.png");
export const referenceBillImage = require("../../assets/icons/refImage.png");
export const circleTickImage = require("../../assets/images/circleTickImage.png");
export const addItemIcon = require("../../assets/icons/addItemIcon.png");

export const settingsLinks = {
  General: [
    {
      title: "Upgrade To Premium",
      link: "/offerWall/index",
      type: "route",
    },
  ],
  Support: [
    {
      title: "Contact Us",
      link: `mailto:${supportEmail}`,
      type: "link",
    },
    {
      title: "Privacy Policy",
      link: "/legal/privacyPolicy",
      type: "route",
    },
    {
      title: "Terms of Use",
      link: "/legal/termsOfUse",
      type: "route",
    },
    {
      title: "Delete Account",
      link: "/Settings/DeleteAccount",
      type: "route",
    },
  ],
};

export const termsOfUse =
  "By using this mobile app, you agree to comply with and be bound by these Terms of Use. The app is provided “as is” for personal, non-commercial use. You may not misuse, modify, or redistribute the app or its content. We reserve the right to update or terminate services at any time without notice. All content and features are owned by the app developer and protected by copyright. We are not liable for any damages or losses resulting from use. Continued use of the app constitutes acceptance of these terms. For inquiries, contact us at [your email]. By using this mobile app, you agree to comply with and be bound by these Terms of Use. The app is provided “as is” for personal, non-commercial use. You may not misuse, modify, or redistribute the app or its content. We reserve the right to update or terminate services at any time without notice. All content and features are owned by the app developer and protected by copyright. We are not liable for any damages or losses resulting from use. Continued use of the app constitutes acceptance of these terms. For inquiries, contact us at [your email].";

export const privacyPolicy =
  "By using this mobile app, you agree to comply with and be bound by these Terms of Use. The app is provided “as is” for personal, non-commercial use. You may not misuse, modify, or redistribute the app or its content. We reserve the right to update or terminate services at any time without notice. All content and features are owned by the app developer and protected by copyright. We are not liable for any damages or losses resulting from use. Continued use of the app constitutes acceptance of these terms. For inquiries, contact us at [your email]. By using this mobile app, you agree to comply with and be bound by these Terms of Use. The app is provided “as is” for personal, non-commercial use. You may not misuse, modify, or redistribute the app or its content. We reserve the right to update or terminate services at any time without notice. All content and features are owned by the app developer and protected by copyright. We are not liable for any damages or losses resulting from use. Continued use of the app constitutes acceptance of these terms. For inquiries, contact us at [your email].";

export const offerWallTerms =
  "If you choose the purchase a subscription, payment will be charged to your Google Play Store account and your account will be charged within 24-hours prior to the end of the current period for $60/yearly, You can cancel the automatic renewal of your subscription at any time by going to your setting in the Google Play store after purchase.";
