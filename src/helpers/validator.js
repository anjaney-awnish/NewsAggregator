class validator{
    static validateNewUserData(new_userData,usersData){
        if(new_userData.hasOwnProperty("id")&&
        new_userData.hasOwnProperty("email")&&
        new_userData.hasOwnProperty("password")&&
        new_userData.hasOwnProperty("preferences")&&this.validateUniqueEmail(new_userData,usersData) && this.validateEmailPattern(new_userData)
        && this.validatePasswordPattern(new_userData)){
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
            if(!this.validateEmailPattern(new_userData) && new_userData.email!=undefined){
                return{
                    "status":false,
                    "message":"Invalid Email Pattern"
                };
            }

            if(!this.validatePasswordPattern(new_userData) && new_userData.password!=undefined){
                return {
                    "status":false,
                    "message":"Password should be atleast 8 characters long, has at least 1 special character, 1 digit, 1 lowercase and 1 uppercase"
                }
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

        static validateEmailPattern(new_userData){
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(new_userData.email) ;
        }

        static validatePasswordPattern(new_userData){
            const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
            return passwordRegex.test(new_userData.password);
        }
    }

module.exports=validator