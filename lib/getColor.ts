// List of predefined colors
const colors = [
    '#04eeff', '#ed1e79', '#39ff14', '#ff00ff', '#FFFF00', '#02B59F',
    '#FF512F', '#0062FF', '#FFFFFF', '#83018E', '#D00005', '#138AAF',
    '#BE9E56', '#FF61D2', '#004E92', '#FF1F4F', '#FBB03B', '#FBB03B',
  ];
  
  /**
   * Function to assign a color to a user based on their unique ID.
   * @param {string} userId - The unique ID of the user.
   * @returns {string} - The assigned color.
   */
  export function getAssignedColor(userId: string) {
    // Use the last 4 characters of the userId as a hex string to determine the index
    const index = parseInt(userId.slice(-4), 16) % colors.length;
    return colors[index];
  }
  