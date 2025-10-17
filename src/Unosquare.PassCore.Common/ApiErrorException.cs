﻿using System;

namespace Unosquare.PassCore.Common;

/// <inheritdoc />
/// <summary>
/// Special Exception to transport the ApiErrorItem.
/// </summary>
public class ApiErrorException : Exception
{
    /// <summary>
    /// Initializes a new instance of the <see cref="ApiErrorException"/> class.
    /// </summary>
    public ApiErrorException() : base() => ErrorCode = ApiErrorCode.Generic;

    /// <summary>
    /// Initializes a new instance of the <see cref="ApiErrorException"/> class.
    /// </summary>
    /// <param name="message">The message.</param>
    public ApiErrorException(string message) : base(message) => ErrorCode = ApiErrorCode.Generic;

    /// <summary>
    /// Initializes a new instance of the <see cref="ApiErrorException"/> class.
    /// </summary>
    /// <param name="message">The message.</param>
    /// <param name="innerException">The inner exception.</param>
    public ApiErrorException(string message, Exception innerException) : base(message, innerException) => ErrorCode = ApiErrorCode.Generic;

    /// <summary>
    /// Initializes a new instance of the <see cref="ApiErrorException"/> class.
    /// </summary>
    /// <param name="message">The message.</param>
    /// <param name="errorCode">The error code.</param>
    public ApiErrorException(string message, ApiErrorCode errorCode = ApiErrorCode.Generic)
        : base(message) => ErrorCode = errorCode;

    /// <summary>
    /// Gets or sets the error code.
    /// </summary>
    /// <value>
    /// The error code.
    /// </value>
    public ApiErrorCode ErrorCode { get; }

    /// <inheritdoc />
    public override string Message => $"Error Code: {ErrorCode}\r\n{base.Message}";

    /// <summary>
    /// To the API error item.
    /// </summary>
    /// <returns>An API Error Item.</returns>
    public ApiErrorItem ToApiErrorItem() => new(ErrorCode, base.Message);
}