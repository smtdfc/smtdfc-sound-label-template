const connectDB = require("./connect")
const { DataTypes } = require("sequelize")

globalThis._db = {}
globalThis.Models = {}

module.exports = function initModel() {
  connectDB()

  // UserAccounts Model
  const UserAccounts = globalThis._db.main.define('user_accounts', {
    userID: {
      type: DataTypes.TEXT,
      primaryKey: true,
      field: 'user_id',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      field: 'user_name',
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'avatar'
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'active',
    },
  }, {
    freezeTableName: true,
    tableName: 'user_accounts',
    underscored: true,
    timestamps: false
  });

  // UserAuth Model
  const UserAuth = globalThis._db.main.define('user_auth', {
    userID: {
      type: DataTypes.TEXT,
      references: {
        model: UserAccounts,
        key: 'userID',
      },
      field: 'user_id',
    },
    authType: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'auth_type',
    },
    authProvider: {
      type: DataTypes.STRING,
      field: 'auth_provider',
    },
    authKey: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'auth_key',
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'active',
    },
  }, {
    freezeTableName: true,
    tableName: 'user_auth',
    underscored: true,
    timestamps: false
  });

  // Session Model
  const Session = globalThis._db.main.define('Session', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sid: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    userID: {
      type: DataTypes.TEXT,
      references: {
        model: UserAccounts,
        key: 'userID',
      },
      field: 'user_id',
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    appID: {
      type: DataTypes.TEXT,
      field: 'app_id',
    },
    time: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    isSso: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_sso',
    },
  }, {
    freezeTableName: true,
    tableName: 'sessions',
    underscored: true,
    timestamps: false
  });

  // LoginHistory Model
  const LoginHistory = globalThis._db.main.define('LoginHistory', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userID: {
      type: DataTypes.TEXT,
      references: {
        model: UserAccounts,
        key: 'userID',
      },
      field: 'user_id',
    },
    appID: {
      type: DataTypes.TEXT,
      field: 'app_id',
    },
    rid:{
      type: DataTypes.STRING,
    },
    sid: {
      type: DataTypes.STRING,
    },
    time: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    ip: {
      type: DataTypes.INET,
      allowNull: false,
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
  }, {
    freezeTableName: true,
    tableName: 'login_histories',
    underscored: true,
    timestamps: false
  });


  // Define Associations
  UserAuth.belongsTo(UserAccounts, { foreignKey: 'userID', as: 'userInfo' });
  UserAccounts.hasMany(UserAuth, { foreignKey: 'userID', as: "userAuthInfo" });

  UserAccounts.hasMany(Session, { foreignKey: 'userID' });
  UserAccounts.hasMany(LoginHistory, { foreignKey: 'userID' });

  Session.belongsTo(UserAccounts, { foreignKey: 'userID', as: 'userInfo' });

  globalThis.Models = {
    UserAccounts,
    UserAuth,
    Session,
    LoginHistory,
  };
}