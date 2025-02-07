export interface UserInformation {
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  iat: number;
  amr: string[];
  name: string;
  picture: string;
}

export interface UserFromDB {
  u_id: string;
  username: string;
  profile_picture: string;
  points: {
    pointA: number;
    pointB: number;
    pointC: number;
  };
  pets_owned: string[];
  pets_equipped: string[];
}