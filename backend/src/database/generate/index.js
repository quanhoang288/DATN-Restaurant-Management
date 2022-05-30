/**
 * Generate primary key
 * @param DataTypes
 * @returns {{id: {type: *, autoIncrement: boolean, primaryKey: boolean, allowNull: boolean}}}
 */
const id = (DataTypes, options = {}) => ({
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    ...options,
  },
});

/**
 * Generate timestamp column
 * @param DataTypes
 * @returns {{created_at: {type: *, allowNull: boolean}, updated_at: {type: *, allowNull: boolean}}}
 */
const timeStamp = (DataTypes) => ({
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

/**
 * Generate soft delete column
 * @param DataTypes
 * @returns {{deleted_at: {type: *}}}
 */
const deletedAt = (DataTypes) => ({
  deleted_at: {
    type: DataTypes.DATE,
  },
});

/**
 * Generate datetime column
 * @param DataTypes
 * @returns {{created_at: {type: *}, updated_at: {type: *}, deleted_at: {type: *}}}
 */
const dateTime = (DataTypes) => ({
  ...timeStamp(DataTypes),
  ...deletedAt(DataTypes),
});

module.exports = {
  id,
  dateTime,
  timeStamp,
};
