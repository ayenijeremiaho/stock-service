class NotFoundError extends Error {
    constructor(msg) {
        super(msg);
    }
}

exports.NotFoundError = NotFoundError;