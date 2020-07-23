 const paginate = (dataArray, page_size, page_number) => {
    if(page_size > dataArray.length){
        return dataArray;
    }
    if(page_number > dataArray.length){
        return dataArray;
    }
    console.log((page_number - 1) * page_size, page_number * page_size)
    return dataArray.slice((page_number - 1) * page_size, page_number * page_size);
}
module.exports= paginate