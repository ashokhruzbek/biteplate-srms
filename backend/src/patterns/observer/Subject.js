// Subject - observer-larni boshqarish uchun base class

class Subject {
  constructor() {
    this.observers = [];
  }

  attach(observer) {
    if (!observer || typeof observer.update !== "function") {
      throw new Error("Valid observer object berilishi kerak");
    }

    this.observers.push(observer);
  }

  detach(observer) {
    this.observers = this.observers.filter(
      (registeredObserver) => registeredObserver !== observer
    );
  }

  notify(order) {
    for (const observer of this.observers) {
      observer.update(order);
    }
  }
}

module.exports = Subject;
