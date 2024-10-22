const isObjectEmpty = (myEmptyObj) => {
  return Object.keys(myEmptyObj).length === 0 && myEmptyObj.constructor === Object
}


export {
    isObjectEmpty
}