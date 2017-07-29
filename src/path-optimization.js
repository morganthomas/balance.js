/*

This module solves the problem of "path optimization." A path optimization problem is an object
of the following form:

{
  initialPath,
  advance,
  isFeasible,
  utility,
  maxThreads,
  pathsAreEqual
}

For more details see the design document. TODO: more details right here

*/

function solvePathOptimizationProblem(problem) {
  let threads = [problem.initialPath];

  let allThreadsAreComplete = false;

  while (!allThreadsAreComplete) {
    let newThreads = [];

    allThreadsAreComplete = true; // assume true until falsified
    threads.forEach(thread => {
      let advancedThreads = problem.advance(thread);
      // if this thread is complete, then allThreadsAreComplete is falsified
      if (!(advancedThreads.length === 1 && problem.pathsAreEqual(advancedThreads[0], thread))) {
        allThreadsAreComplete = false;
      }
      // collect all the feasible advanced threads
      advancedThreads.forEach(advancedThread => {
        if (problem.isFeasible(advancedThread)) {
          newThreads.push(advancedThread);
        }
      });
    });

    if (newThreads.length > problem.maxThreads) {
      newThreads.sort((a,b) => problem.utility(a) - problem.utility(b));
    }

    threads = newThreads;
  }

  let bestThread = null;
  let bestThreadUtility = Infinity;
  threads.forEach(thread => {
    let threadUtility = problem.utility(thread);
    if (threadUtility < bestThreadUtility) {
      bestThread = thread;
      bestThreadUtility = threadUtility;
    }
  });

  return bestThread;
}

export { solvePathOptimizationProblem }
