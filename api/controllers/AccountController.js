/**
 * AccountController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    info_account: async function (req, res) {
        try {
            const userid = req.params.id;
            console.log("userid", userid);

            const user = await Account.find({ where: { accountid: userid } });
     
            const profile = await User.findOne({ id: userid });


            console.log("ghfchvgh", user);
            // console.log("ghfchvgh account333", accounts);
            
            console.log("ghfchvg h profile ", profile);
            return res.view("dashboard", {
                accountid: user,
                all: userid,
                profile: profile,
                err: null,
                result: 'Success'
            });
        } catch (err) {
           
            console.log(err);
        }
    },


    info_account_member: async function (req, res) {
        try {
            const userid = req.params.id;
            console.log("userid", userid);

            const member = await Accountbyemail.find({
                where: { emailAccountid: userid },
            });

            console.log('member account',member)

            let accounts = [];
            
            if(member.length >  0) {
                for(let member1 of member) {
                    accounts.push(await Account.findOne({ where: { id: member1.useremailAccountid} }).populate('accountid')) ;
                }
            }

            console.log('member dhhdilelel',accounts)
            
            return res.view("viewMemberAccount", {
                all: userid,
                member: accounts,
            });
        } catch (err) {
    
            console.log(err);
        }
    },
    addUserEmailPage: async (req, res) => {
        const id = req.params.id;

        const data = req.user.userid;
        console.log("data user id", data);
        return res.view("addUserByEmail", { all: id, allnew: data, err: null });

    },

    //Add user to account by Email

    addUserEmail: async (req, res) => {
        console.log("for add user by email");
        const email = req.body.email;
        const id = req.params.id;
        console.log('added email',email)
        console.log("user id", id);
        console.log("for add user by email into account id", id);

        const user = await User.findOne({ 
           where: { email: email}
        });
        console.log("user data", user);

        
       if (user) {
        const useremail = await Accountbyemail.findOne({where: {emailAccountid: user.id, useremailAccountid: id}})
        console.log('user email added',useremail)

        if (useremail) {
            return res.view('addUserByEmail', { all: id, allnew: req.user.userid, err: 'User already added' });

        }

        const usernew = user.id;
        console.log("user id for acc", usernew);
        Account.addToCollection(id, "emailAccountid", usernew).then(
            (result) => {
                console.log("added data", result);
                console.log("add user", req.user.userid);
                const id = req.user.userid;
                // return res.view('dashboard', {all: id})
                return res.redirect(`/dashboarduser/${id}`);
            }
        );
       } else {
        return res.view('addUserByEmail', { all: id, allnew: req.user.userid, err: 'No such email' });
       }
        

    },
};
