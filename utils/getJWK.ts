import axios from "axios";

class JWKs {
  private static region = process.env.AWS_REGION;
  private static userPoolId = process.env.COGNITO_POOL_ID;
  static async get() {
    try {
      const res = await axios.get(
        `https://cognito-idp.${this.region}.amazonaws.com/${this.userPoolId}/.well-known/jwks.json`
      );
      return res.data;
    } catch (err) {
      throw err;
    }
  }
}

export default JWKs;
