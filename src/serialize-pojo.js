/*

This file is for turning a POJO into a sequential array of the scalars it contains, and then
reversing the transformation. This is done with two functions:

serializePOJO(pojo)
  ASSUMES pojo is a POJO
  Outputs an array containing all the scalars in pojo arranged in a deterministic linear sequence.

deserializePOJO(referencePojo, array)
  ASSUMES
    pojo is a POJO
    array is the result of calling serializePOJO on some POJO congruent to pojo

*/
