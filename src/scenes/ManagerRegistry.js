export class ManagerRegistry {
    constructor(scene) {
      this.scene = scene;
      this.managers = {}; // Stores initialized managers
    }
  
    getNotificationManager() {
      if (!this.managers.notificationManager) {
        this.managers.notificationManager = new NotificationManager(this.scene);
      }
      return this.managers.notificationManager;
    }
  
    getSoundManager() {
      if (!this.managers.soundManager) {
        this.managers.soundManager = new SoundManager(this.scene);
      }
      return this.managers.soundManager;
    }
  
    getLogManager() {
      if (!this.managers.logManager) {
        this.managers.logManager = new LogManager();
      }
      return this.managers.logManager;
    }
  }
  