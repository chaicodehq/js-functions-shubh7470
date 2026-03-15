/**
 * 🎉 Festival Countdown Planner - Module Pattern
 *
 * Indian festivals ka planner bana! Module pattern use karna hai —
 * matlab ek function jo ek object return kare jisme public methods hain,
 * lekin andar ka data PRIVATE rahe (bahar se directly access na ho sake).
 *
 * Function: createFestivalManager()
 *
 * Returns an object with these PUBLIC methods:
 *
 *   - addFestival(name, date, type)
 *     date is "YYYY-MM-DD" string, type is "religious"/"national"/"cultural"
 *     Returns new total count of festivals
 *     Agar name empty or date not string or invalid type, return -1
 *     No duplicate names allowed (return -1 if exists)
 *
 *   - removeFestival(name)
 *     Returns true if removed, false if not found
 *
 *   - getAll()
 *     Returns COPY of all festivals array (not the actual private array!)
 *     Each festival: { name, date, type }
 *
 *   - getByType(type)
 *     Returns filtered array of festivals matching type
 *
 *   - getUpcoming(currentDate, n = 3)
 *     currentDate is "YYYY-MM-DD" string
 *     Returns next n festivals that have date >= currentDate
 *     Sorted by date ascending
 *
 *   - getCount()
 *     Returns total number of festivals
 *
 * PRIVATE STATE: festivals array should NOT be accessible from outside.
 *   manager.festivals should be undefined.
 *   getAll() must return a COPY so modifying it doesn't affect internal state.
 *   Two managers should be completely independent.
 *
 * Hint: This is the Module Pattern — a function that returns an object
 *   of methods, all closing over shared private variables.
 *
 * @example
 *   const mgr = createFestivalManager();
 *   mgr.addFestival("Diwali", "2025-10-20", "religious");   // => 1
 *   mgr.addFestival("Republic Day", "2025-01-26", "national"); // => 2
 *   mgr.getAll(); // => [{ name: "Diwali", ... }, { name: "Republic Day", ... }]
 *   mgr.getUpcoming("2025-01-01", 1); // => [{ name: "Republic Day", ... }]
 */
export function createFestivalManager() {
  // Your code here
   let festivals = [];

   // ✅ Helper to validate type
   const validTypes = ["religious", "national", "cultural"];
   const isValidType = (type) => validTypes.includes(type);

   // ✅ Helper to parse date
   const parseDate = (str) => {
     const d = new Date(str);
     return isNaN(d) ? null : d;
   };

   return {
     // Add a festival
     addFestival(name, date, type) {
       if (!name || typeof date !== "string" || !isValidType(type)) return -1;
       if (festivals.some((f) => f.name === name)) return -1;

       const d = parseDate(date);
       if (!d) return -1;

       festivals.push({ name, date, type });
       return festivals.length;
     },

     // Remove a festival
     removeFestival(name) {
       const index = festivals.findIndex((f) => f.name === name);
       if (index === -1) return false;
       festivals.splice(index, 1);
       return true;
     },

     // Get copy of all festivals
     getAll() {
       return festivals.map((f) => ({ ...f }));
     },

     // Get festivals by type
     getByType(type) {
       if (!isValidType(type)) return [];
       return festivals.filter((f) => f.type === type).map((f) => ({ ...f }));
     },

     // Get next n upcoming festivals from currentDate
     getUpcoming(currentDate, n = 3) {
       const now = parseDate(currentDate);
       if (!now) return [];

       return festivals
         .filter((f) => parseDate(f.date) >= now)
         .sort((a, b) => parseDate(a.date) - parseDate(b.date))
         .slice(0, n)
         .map((f) => ({ ...f }));
     },

     // Get total count
     getCount() {
       return festivals.length;
     },
   };
}
