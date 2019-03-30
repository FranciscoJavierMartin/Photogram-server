import jwt from 'jsonwebtoken';

export default class Token {
  // This seed must be secret. Change when will be used in production
  private static seed: string = 'This-is-a-secret';
  private static expiration: string = '30d';

  constructor(){}

  static getJwtToken(payload: any): string{
    return jwt.sign({
      user: payload
    }, this.seed, {expiresIn: this.expiration});
  }

  static checkToken(userToken: string){
    return new Promise((resolve,reject) => {
      jwt.verify(userToken, this.seed, (err, decoded) => {
        if(err){
          reject();
        }else{
          resolve(decoded);
        }
      });
    });
  }

}
