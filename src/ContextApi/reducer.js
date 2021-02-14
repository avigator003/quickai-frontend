export const initialState={   
   flight:null
}

const reducer=(state,action)=>{
console.log("type",action.item)
   switch(action.type){
case 'ADD_TO_FLIGHT':
   console.log("Add")
   return {
      ...state,flight:action.item
}
   }
}


export default reducer;