export const donationOverviewData = [
  { date: "May 1", value: 5 },
  { date: "May 7", value: 18 },
  { date: "May 14", value: 12 },
  { date: "May 21", value: 25 },
  { date: "May 28", value: 38 },
];

export const userDonations = [
  { id: "DN001", item: "Food Packets", qty: "2 items", ngo: "Helping Hands NGO", date: "May 23", status: "Completed" },
  { id: "DN002", item: "3 Blankets", qty: "3 items", ngo: "Green Earth Foundation", date: "May 24", status: "Pending" },
  { id: "DN003", item: "School Bag", qty: "1 item", ngo: "Educate All Foundation", date: "May 18", status: "Completed" },
  { id: "DN004", item: "Books", qty: "4 items", ngo: "Sunshine Orphanage", date: "May 17", status: "Completed" },
];

export const nearbyNGOs = [
  { name: "Helping Hands NGO", dist: "2.1 km", area: "Bandra", rating: 4.8, cats: "Food, Clothes" },
  { name: "Green Earth", dist: "3.4 km", area: "Andheri", rating: 4.6, cats: "Environment" },
];

export const adminOverviewData = [
  { date: "Mon", value: 120 },
  { date: "Tue", value: 180 },
  { date: "Wed", value: 150 },
  { date: "Thu", value: 220 },
  { date: "Fri", value: 260 },
  { date: "Sat", value: 240 },
  { date: "Sun", value: 300 }
];

export const recentActivity = [
  { icon: "🎁", text: "New donation received", time: "10 min ago" },
  { icon: "🏢", text: "NGO approved", time: "30 min ago" },
  { icon: "👤", text: "New user registered", time: "1 hour ago" }
];

export const adminUsers = [
  { name: "Rahul Sharma", email: "rahul@gmail.com", role: "User", joined: "Jan 12", donations: 5, status: "Active" },
  { name: "Priya Patel", email: "priya@gmail.com", role: "User", joined: "Feb 20", donations: 2, status: "Pending" }
];

export const adminNGOs = [
  { name: "Helping Hands", location: "Mumbai", registered: "Jan 2024", status: "Approved" },
  { name: "Care Foundation", location: "Delhi", registered: "Feb 2024", status: "Pending" }
];

export const adminDonations = [
  { id: "#D001", item: "Food Packets", qty: "10 packs", donor: "Rahul", ngo: "Helping Hands", date: "Today" },
  { id: "#D002", item: "Clothes", qty: "5 bags", donor: "Priya", ngo: "Care Foundation", date: "Yesterday" }
];