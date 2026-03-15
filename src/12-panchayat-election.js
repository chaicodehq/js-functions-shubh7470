/**
 * 🗳️ Panchayat Election System - Capstone
 *
 * Village ki panchayat election ka system bana! Yeh CAPSTONE challenge hai
 * jisme saare function concepts ek saath use honge:
 * closures, callbacks, HOF, factory, recursion, pure functions.
 *
 * Functions:
 *
 *   1. createElection(candidates)
 *      - CLOSURE: private state (votes object, registered voters set)
 *      - candidates: array of { id, name, party }
 *      - Returns object with methods:
 *
 *      registerVoter(voter)
 *        - voter: { id, name, age }
 *        - Add to private registered set. Return true.
 *        - Agar already registered or voter invalid, return false.
 *        - Agar age < 18, return false.
 *
 *      castVote(voterId, candidateId, onSuccess, onError)
 *        - CALLBACKS: call onSuccess or onError based on result
 *        - Validate: voter registered? candidate exists? already voted?
 *        - If valid: record vote, call onSuccess({ voterId, candidateId })
 *        - If invalid: call onError("reason string")
 *        - Return the callback's return value
 *
 *      getResults(sortFn)
 *        - HOF: takes optional sort comparator function
 *        - Returns array of { id, name, party, votes: count }
 *        - If sortFn provided, sort results using it
 *        - Default (no sortFn): sort by votes descending
 *
 *      getWinner()
 *        - Returns candidate object with most votes
 *        - If tie, return first candidate among tied ones
 *        - If no votes cast, return null
 *
 *   2. createVoteValidator(rules)
 *      - FACTORY: returns a validation function
 *      - rules: { minAge: 18, requiredFields: ["id", "name", "age"] }
 *      - Returned function takes a voter object and returns { valid, reason }
 *
 *   3. countVotesInRegions(regionTree)
 *      - RECURSION: count total votes in nested region structure
 *      - regionTree: { name, votes: number, subRegions: [...] }
 *      - Sum votes from this region + all subRegions (recursively)
 *      - Agar regionTree null/invalid, return 0
 *
 *   4. tallyPure(currentTally, candidateId)
 *      - PURE FUNCTION: returns NEW tally object with incremented count
 *      - currentTally: { "cand1": 5, "cand2": 3, ... }
 *      - Return new object where candidateId count is incremented by 1
 *      - MUST NOT modify currentTally
 *      - If candidateId not in tally, add it with count 1
 *
 * @example
 *   const election = createElection([
 *     { id: "C1", name: "Sarpanch Ram", party: "Janata" },
 *     { id: "C2", name: "Pradhan Sita", party: "Lok" }
 *   ]);
 *   election.registerVoter({ id: "V1", name: "Mohan", age: 25 });
 *   election.castVote("V1", "C1", r => "voted!", e => "error: " + e);
 *   // => "voted!"
 */
export function createElection(candidates) {
  // Your code here
  
   if (!Array.isArray(candidates)) candidates = [];

   // Private state
   const votes = {}; // { candidateId: count }
   const registeredVoters = new Set(); // voterId
   const alreadyVoted = new Set(); // voterId

   // Initialize votes
   candidates.forEach((c) => {
     votes[c.id] = 0;
   });

   return {
     // Register voter
     registerVoter(voter) {
       if (!voter || !voter.id || !voter.name || typeof voter.age !== "number")
         return false;
       if (voter.age < 18) return false;
       if (registeredVoters.has(voter.id)) return false;
       registeredVoters.add(voter.id);
       return true;
     },

     // Cast vote with callbacks
     castVote(voterId, candidateId, onSuccess, onError) {
       if (typeof onSuccess !== "function" || typeof onError !== "function")
         return null;

       if (!registeredVoters.has(voterId))
         return onError("Voter not registered");
       if (!votes.hasOwnProperty(candidateId))
         return onError("Candidate not found");
       if (alreadyVoted.has(voterId)) return onError("Voter already voted");

       votes[candidateId] += 1;
       alreadyVoted.add(voterId);
       return onSuccess({ voterId, candidateId });
     },

     // Get results with optional HOF sorting
     getResults(sortFn) {
       const result = candidates.map((c) => ({
         id: c.id,
         name: c.name,
         party: c.party,
         votes: votes[c.id] || 0,
       }));
       if (typeof sortFn === "function") return result.sort(sortFn);
       return result.sort((a, b) => b.votes - a.votes);
     },

     // Get winner (first among tie)
     getWinner() {
       const result = this.getResults();
       if (result.length === 0 || result.every((r) => r.votes === 0))
         return null;
       return result[0];
     },
   };
}

export function createVoteValidator(rules) {
  // Your code here
  if (!rules || typeof rules !== "object")
    return () => ({ valid: false, reason: "Invalid rules" });

  return (voter) => {
    if (!voter || typeof voter !== "object")
      return { valid: false, reason: "Invalid voter" };

    // Check required fields
    for (const field of rules.requiredFields) {
      if (!voter.hasOwnProperty(field))
        return { valid: false, reason: `${field} missing` };
    }

    // Check age
    if (typeof voter.age !== "number" || voter.age < rules.minAge) {
      return { valid: false, reason: `Age must be >= ${rules.minAge}` };
    }

    return { valid: true, reason: "" };
  };
}

export function countVotesInRegions(regionTree) {
  // Your code here
   if (!regionTree || typeof regionTree !== "object") return 0;
   let total = typeof regionTree.votes === "number" ? regionTree.votes : 0;

   if (Array.isArray(regionTree.subRegions)) {
     for (const sub of regionTree.subRegions) {
       total += countVotesInRegions(sub); // recursion
     }
   }
   return total;
}

export function tallyPure(currentTally, candidateId) {
  // Your code here
  if (!candidateId) return { ...currentTally };
  return {
    ...currentTally,
    [candidateId]: (currentTally[candidateId] || 0) + 1,
  };
}
