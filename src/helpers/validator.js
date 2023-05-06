class validator{
    static validateNewUserData(new_userData,usersData){
        if(new_userData.hasOwnProperty("id")&&
        new_userData.hasOwnProperty("email")&&
        new_userData.hasOwnProperty("password")&&
        new_userData.hasOwnProperty("preferences")&&this.validateUniqueEmail(new_userData,usersData)){
            console.log(new_userData.email)
            return{
                "status":true,
                "message":"User Registered successfully"
            };
        }
            if(!this.validateUniqueEmail(new_userData,usersData)){
                return{
                    "status":false,
                    "message":"email has to be unique"
                };
            }

            return{
                "status":false,
                "message":"user details are incomplete,please provide all properties"
            };

        }

        static validateUniqueEmail(new_userData,usersData){
            let existing_userFound=usersData.users.some(val=>val.email==new_userData.email);
            if (existing_userFound) return false;
            else return true;
        }
    }

module.exports=validator
