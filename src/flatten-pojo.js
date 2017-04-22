/*

This file is for turning a POJO into a sequential array of the scalars it contains, and then
reversing the transformation. This is done with two functions:

flattenPOJO(pojo)
  ASSUMES pojo is a POJO
  Outputs an array containing all the scalars in pojo arranged in a deterministic linear sequence.

unflattenPOJO(referencePojo, array)
  ASSUMES
    pojo is a POJO
    array is the result of calling flattenPOJO on some POJO congruent to pojo
  Outputs a POJO newPojo which is congruent to pojo, such that flattenPOJO(newPojo) outputs array

*/
