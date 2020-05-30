module.exports = {
	isEmpty(data){
		const conditions = [undefined, null, ""];
		
		for(let property in data){
			if(conditions.includes(data[property])) return true
		}
		return false
	}
}