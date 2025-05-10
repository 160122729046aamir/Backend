const mongoose = require('mongoose');
const Review = require('./models/Review');
require('dotenv').config();

const reviews = [
  {
    name: "Konark T.",
    service: "Electrical Repair",
    rating: 5,
    content: "Highly recommend, Prakash was excellent at his work and very efficient! Diagnosed issues right away and suggested next steps. Will rebook for all other tasks going forward. 5 star work.",
    role: "Customer",
    image: "",
    verified: true,
    date: new Date("2025-05-02T10:00:00Z")
  },
  {
    name: "Victoria H.",
    service: "Water Heater Controller Replacement",
    rating: 5,
    content: "Fantastic service from Kaz. Very friendly and professional. Discussed all options with us. Will definitely use again.",
    role: "Customer",
    image: "",
    verified: true,
    date: new Date("2025-04-18T10:00:00Z")
  },
  {
    name: "Wayne W.",
    service: "Surround Sound Repair",
    rating: 4,
    content: "He knows his stuff as he is taking my old one away and bringing me a refurb at a good price.",
    role: "Customer",
    image: "",
    verified: true,
    date: new Date("2025-04-17T10:00:00Z")
  },
  {
    name: "Joseph G.",
    service: "E-bike Service",
    rating: 5,
    content: "High quality service. Would use again.",
    role: "Customer",
    image: "",
    verified: true,
    date: new Date("2025-04-16T10:00:00Z")
  },
  {
    name: "Karen B.",
    service: "Treadmill Service",
    rating: 5,
    content: "Carried out a service. Fixed the sound and belt. Great communication and price. Good advice given for future maintenance.",
    role: "Customer",
    image: "",
    verified: true,
    date: new Date("2025-04-15T10:00:00Z")
  },
  {
    name: "Netsai R.",
    service: "Electrician",
    rating: 5,
    content: "He has done a good job. He explained everything he was going to do. Happy customer. Will recommend.",
    role: "Customer",
    image: "",
    verified: true,
    date: new Date("2025-04-14T10:00:00Z")
  },
  {
    name: "Muhammad N.",
    service: "Treadmill Repair",
    rating: 4,
    content: "Nice service, thanks.",
    role: "Customer",
    image: "",
    verified: true,
    date: new Date("2025-04-13T10:00:00Z")
  },
  {
    name: "Marnela C.",
    service: "Coffee Machine Repair",
    rating: 5,
    content: "Our issue for call out was successfully resolved within minutes of his arrival and ended up servicing the machine with the available time. Communicated when caught in traffic.",
    role: "Customer",
    image: "",
    verified: true,
    date: new Date("2025-04-12T10:00:00Z")
  },
  {
    name: "William A.",
    service: "Treadmill Belt Repair",
    rating: 5,
    content: "Great at his job, very intelligent.",
    role: "Customer",
    image: "",
    verified: true,
    date: new Date("2025-04-11T10:00:00Z")
  },
  {
    name: "Pedro S.",
    service: "Coffee Machine Repair",
    rating: 4,
    content: "Very competent. Good service.",
    role: "Customer",
    image: "",
    verified: true,
    date: new Date("2025-04-10T10:00:00Z")
  },
  {
    name: "Vittorio G.",
    service: "Electric Bidet Seat Replacement",
    rating: 5,
    content: "A very smart guy who can diagnose and solve problems very effectively.",
    role: "Customer",
    image: "",
    verified: true,
    date: new Date("2025-04-10T10:00:00Z")
  },
  {
    name: "Monia P.",
    service: "Thermostat Malfunction Repair",
    rating: 5,
    content: "Great job done fast thank you.",
    role: "Customer",
    image: "",
    verified: true,
    date: new Date("2025-04-09T10:00:00Z")
  },
  {
    name: "Blake M.",
    service: "Treadmill Installation",
    rating: 5,
    content: "I already feeling good energy today, he made me feel even better. He knows what is doing...",
    role: "Customer",
    image: "",
    verified: true,
    date: new Date("2025-04-08T10:00:00Z")
  },
  {
    name: "Murray B.",
    service: "Coffee Machine Repair",
    rating: 5,
    content: "Great job. Fixed my coffee machine in no time.",
    role: "Customer",
    image: "",
    verified: true,
    date: new Date("2025-04-07T10:00:00Z")
  },
  {
    name: "Samuel B.",
    service: "Smeg Coffee Machine Electrics Fix",
    rating: 4,
    content: "Great would recommend to anyone.",
    role: "Customer",
    image: "",
    verified: true,
    date: new Date("2025-04-06T10:00:00Z")
  },
  {
    name: "Luke M.",
    service: "Telephone Port to Ethernet Port Change",
    rating: 5,
    content: "Great work. Good communication.",
    role: "Customer",
    image: "",
    verified: true,
    date: new Date("2025-04-05T10:00:00Z")
  },
  {
    name: "Julia D.",
    service: "Dishwasher Repair",
    rating: 5,
    content: "Super helpful and friendly thank you! Fixed my dishwasher no problem :)",
    role: "Customer",
    image: "",
    verified: true,
    date: new Date("2025-04-04T10:00:00Z")
  },
  {
    name: "RICARDO M.",
    service: "Treadmill Belt Replacement",
    rating: 5,
    content: "Absolutely brilliant… knows exactly what he is doing … true professional.",
    role: "Customer",
    image: "",
    verified: true,
    date: new Date("2025-04-03T10:00:00Z")
  },
  {
    name: "Tom L.",
    service: "Electrical Problem Solving",
    rating: 5,
    content: "Prakash was diligent, solved a difficult problem and finished the job very neatly. For anything electrical I would highly recommend him. A*",
    role: "Customer",
    image: "",
    verified: true,
    date: new Date("2025-04-02T10:00:00Z")
  },
  {
    name: "Judith S.",
    service: "Intercom Installation",
    rating: 5,
    content: "Very personable and efficient.",
    role: "Customer",
    image: "",
    verified: true,
    date: new Date("2025-04-01T10:00:00Z")
  },
  {
    name: "gyunay y.",
    service: "Stacked Washing Machine and Tumble Dryer Installation",
    rating: 5,
    content: "Very professional profound knowledge in electronics helped and assessed properly",
    role: "Customer",
    image: "",
    verified: true,
    date: new Date("2025-03-31T10:00:00Z")
  },
  {
    name: "Kareem A.",
    service: "Multimedia Update",
    rating: 5,
    content: "Great customer service and reliable",
    role: "Customer",
    image: "",
    verified: true,
    date: new Date("2025-03-30T10:00:00Z")
  },
  {
    name: "Peter A.",
    service: "Treadmill Repair Assistance",
    rating: 5,
    content: "Very knowledgeable and pleased that he fitted me in during a long day",
    role: "Customer",
    image: "",
    verified: true,
    date: new Date("2025-03-29T10:00:00Z")
  },
  {
    name: "Joel B.",
    service: "Car Battery Jump Start or Replacement",
    rating: 5,
    content: "Great tasker! Will use again!",
    role: "Customer",
    image: "",
    verified: true,
    date: new Date("2025-03-28T10:00:00Z")
  },
  {
    name: "J O.",
    service: "Commercial Dishwasher Repair",
    rating: 5,
    content: "Brilliant service. Fantastic communication. Went above and beyond. Recommend 100%",
    role: "Customer",
    image: "",
    verified: true,
    date: new Date("2025-03-27T10:00:00Z")
  },
  {
    name: "Shaan K.",
    service: "Sony TV PSU Replacement",
    rating: 5,
    content: "Kaz was amazing, gave us more than a quality service but some great advice on the treadmill, how to maintain it and was very quick efficient. Has a great eye for detail and gets the job done to a good standard. Also an amazing person to have a chat with about anything.",
    role: "Customer",
    image: "",
    verified: true,
    date: new Date("2025-03-26T10:00:00Z")
  },
  {
    name: "Katie P.",
    service: "Treadmill Repair",
    rating: 5,
    content: "They went above and beyond all expectations, demonstrating an impressive level of professionalism throughout the process.",
    role: "Customer",
    image: "",
    verified: true,
    date: new Date("2025-03-25T10:00:00Z")
  },
  {
    name: "DJ S.",
    service: "Stereo Installation",
    rating: 5,
    content: "Went over and beyond. Very pleased with work done.",
    role: "Customer",
    image: "",
    verified: true,
    date: new Date("2025-03-24T10:00:00Z")
  },
  {
    name: "Neil C.",
    service: "Bernina Aurora 430 Repair",
    rating: 5,
    content: "Brilliant service all round!",
    role: "Customer",
    image: "",
    verified: true,
    date: new Date("2025-03-23T10:00:00Z")
  },
  {
    name: "Sam B.",
    service: "Treadmill Motor and Controller Replacement",
    rating: 5,
    content: "Kaz was awesome! Sorted my AES intercom which was causing us such issues. Thank you.!",
    role: "Customer",
    image: "",
    verified: true,
    date: new Date("2025-03-22T10:00:00Z")
  }
];

async function seedReviews() {
  await mongoose.connect(process.env.MONGO_URI);
  await Review.deleteMany({});
  await Review.insertMany(reviews);
  console.log('Reviews seeded!');
  await mongoose.disconnect();
}

seedReviews().catch(console.error);