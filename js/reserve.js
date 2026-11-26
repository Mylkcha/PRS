// Supabase project information
const SUPABASE_URL = "https://pfqgjqvmnufycshsjcmf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_gmOSKCvkS7D0sKDMpHHY_Q_t0z3eFTO";

// Declare the client outside the if statement
let supabaseClient = null;

//console.log("reserve.js is running");

// Check if Supabase library loaded
if (window.supabase) {
  console.log("Supabase library loaded successfully!");

  // Create the Supabase connection
  supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );

  //console.log("Supabase client created successfully!");

  // Test the database connection
  async function testSupabaseConnection() {
    console.log("Testing Supabase connection...");

    try {
      const { data, error } = await supabaseClient
        .from("courts")
        .select("id")
        .limit(1);

      if (error) {
        console.error("Database connection error:", error.message);
      } else {
        console.log("Database connection successful!");
        console.log("Court records:", data);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  }

  //testSupabaseConnection();

  // Load available courts from Supabase
  async function loadCourts() {
    console.log("Loading courts...");

    const { data: courts, error } = await supabaseClient
      .from("courts")
      .select("id, name")
      .eq("is_active", true)
      .order("name");

    if (error) {
      console.error("Error loading courts:", error.message);
      return;
    }

    // Find the court dropdown
    const courtDropdown = document.getElementById("court");

    // Remove existing options
    courtDropdown.innerHTML = "";

    // Add the default option
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "-- Select a court --";
    courtDropdown.appendChild(defaultOption);

    // Add courts from the database
    courts.forEach(function (court) {
      const option = document.createElement("option");

      option.value = court.id;
      option.textContent = court.name;

      courtDropdown.appendChild(option);
    });

    console.log("Courts loaded successfully:", courts);
  }

  // Run the function
  loadCourts();
} else {
  console.error("Supabase library did not load!");
}

const dateInput = document.getElementById("scheduleDate");
const courtSelection = document.getElementById("courtSelection");
const dateMessage = document.getElementById("dateMessage");
const courtInput = document.getElementById("court");
const timeSelection = document.getElementById("timeSelection");
const bookingTime = document.getElementById("bookingTime");
const durationSelection = document.getElementById("durationSelection");
const bookingDuration = document.getElementById("bookingDuration");
const submitReserve = document.getElementById("submitReserve");
const bookingSummary = document.getElementById("bookingSummary");
const summaryStart = document.getElementById("summaryStart");
const summaryDuration = document.getElementById("summaryDuration");
const summaryEnd = document.getElementById("summaryEnd");
const summaryPrice = document.getElementById("summaryPrice");
const confirmBooking = document.getElementById("confirmBooking");
const confirmationMessage = document.getElementById("confirmationMessage");
const courtImgs = document.getElementsByClassName("court-images");

// Set today as the earliest selectable date
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");
dateInput.min = `${year}-${month}-${day}`;

function hideCourts() {
  //hideCourtImages
  for (let img of courtImgs) {
    img.style.display = "none";
  }
}

// Show or hide the court selection
function updateCourtVisibility() {
  if (dateInput.value !== "") {
    courtSelection.style.display = "block";
    dateMessage.style.display = "none";
  } else {
    courtSelection.style.display = "none";
    dateMessage.style.display = "block";
    courtInput.value = "";
    bookingTime.value = "";
    timeSelection.style.display = "none";
    hideCourts();
  }
}

// Show time choices after selecting a court
function updateTimeVisibility() {
  if (courtInput.value !== "") {
    timeSelection.style.display = "block";
  } else {
    timeSelection.style.display = "none";
    bookingTime.value = "";
    bookingDuration.value = "";
    durationSelection.style.display = "none";
  }
}

// Show duration after selecting a time
function updateDurationVisibility() {
  if (bookingTime.value !== "") {
    durationSelection.style.display = "block";
  } else {
    durationSelection.style.display = "none";
    bookingDuration.value = "";
  }
}

function calculateBookingDetails() {
  if (bookingTime.value !== "" && bookingDuration.value !== "") {
    const startTime = bookingTime.value;
    const duration = Number(bookingDuration.value);
    const timeParts = startTime.split(":");
    let hours = Number(timeParts[0]);
    let minutes = Number(timeParts[1]);

    // Calculate ending time
    hours = hours + duration;

    const endTime = new Date();
    endTime.setHours(hours, minutes);

    // Calculate price
    const hourlyRate = 200;
    const totalPrice = duration * hourlyRate;

    // Display booking details
    summaryStart.textContent = formatTime(startTime);
    summaryDuration.textContent = duration + " hour(s)";
    summaryEnd.textContent = endTime.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
    summaryPrice.textContent = "\u20B1" + totalPrice.toFixed(2);
    bookingSummary.style.display = "block";
  } else {
    bookingSummary.style.display = "none";
  }
}

// Convert 24-hour time into AM/PM format
function formatTime(time) {
  const parts = time.split(":");
  const date = new Date();
  date.setHours(Number(parts[0]), Number(parts[1]));
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function confirmBookingDetails() {
  // Check if all booking details are selected
  if (
    dateInput.value !== "" &&
    courtInput.value !== "" &&
    bookingTime.value !== "" &&
    bookingDuration.value !== ""
  ) {
    // Ask the customer to confirm
    const answer = confirm("Are you sure you want to confirm this booking?");
    if (answer) {
      confirmationMessage.style.display = "block";
      confirmationMessage.textContent =
        "Your booking details are ready! Actual reservation is not yet saved.";
    }
  } else {
    alert("Please complete all booking details first.");
  }
}

function showCourt() {
  //Show image of selected court
  let selectedText = courtInput.options[courtInput.selectedIndex].text;

  if (selectedText === "Court 1") {
    document.getElementById("court2Image").style.display = "none";
    document.getElementById("court1Image").style.display = "block";
  } else if (selectedText === "Court 2") {
    document.getElementById("court1Image").style.display = "none";
    document.getElementById("court2Image").style.display = "block";
  }
}

// Run when the page opens
updateCourtVisibility();
updateTimeVisibility();
updateDurationVisibility();

// Listen for changes
dateInput.addEventListener("change", updateCourtVisibility);
courtInput.addEventListener("change", updateTimeVisibility);
courtInput.addEventListener("change", showCourt);
bookingTime.addEventListener("change", updateDurationVisibility);
bookingTime.addEventListener("change", calculateBookingDetails);
bookingDuration.addEventListener("change", calculateBookingDetails);
confirmBooking.addEventListener("click", confirmBookingDetails);
