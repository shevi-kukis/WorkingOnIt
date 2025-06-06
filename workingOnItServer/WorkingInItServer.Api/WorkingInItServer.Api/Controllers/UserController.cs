﻿using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using System.Drawing;
using WorkingInIt.Api.ModalsDto;
using WorkingOnIt.Core.Dtos;
using WorkingOnIt.Core.Entities;
using WorkingOnIt.Core.InterfaceService;
using WorkingOnIt.Core.ModalsDto;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims; // וודא ששימוש ב-Task נעשה נכון
namespace WorkingInIt.Api.Controllers
{
    [Route("api/[controller]")]

    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserService _service;
        private readonly IResumeService _resumeService;

        private readonly IMapper _mapper;

        public UserController(IUserService service, IMapper mapper,IResumeService resumeService)
        {
            _service = service;
            _mapper = mapper;
            _resumeService= resumeService;
        }

        // GET: api/<UserController>
        [Authorize(Policy = "UserOrAdmin")]
        [HttpGet]
        public async Task<ActionResult<List<UserDto>>> Get()
        {
            var users = await _service.GetAllAsync(); // מתודע אסינכרונית
            return Ok(users.Select(user => new { user.Id, user.FullName, user.Email }));
        }

        // GET api/<UserController>/5
        [Authorize(Policy = "UserOrAdmin")]
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> Get(int id)
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(new { result.Id, result.FullName, result.Email });
        }

        // POST api/<UserController>
        [Authorize(Policy = "UserOrAdmin")]
        [HttpPost]
        public async Task<ActionResult<bool>> Post([FromBody] UserDto value)
        {
            var result = await _service.AddAsync(value); // קריאה אסינכרונית
            if (result != null)
                return Ok(true); // מחזירים true אם התוצאה אינה null
            return BadRequest(value);
        }

        // PUT api/<UserController>/5
        [Authorize(Policy = "UserOrAdmin")]
        [HttpPut("{id}")]
        public async Task<ActionResult<UserDto>> Put(int id, [FromBody] UserDto value)
        {
            var result = await _service.UpdateAsync(id, value); // קריאה אסינכרונית
            return Ok(result);
        }

        // DELETE api/<UserController>/5
        [Authorize(Policy = "AdminOnly")]
        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> Delete(int id)
        {
            var result = await _service.DeleteAsync(id); // קריאה אסינכרונית
            return result ? Ok(true) : NotFound();
        }

        [Authorize(Policy = "UserOrAdmin")]
     


        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UserUpdateDto userUpdateDto)
        {
            try
            {
                var userDto = _mapper.Map<UserDto>(userUpdateDto);
                var updatedUser = await _service.UpdateUserAsync(id, userDto); // קריאה אסינכרונית
                return Ok(updatedUser);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [Authorize(Policy = "UserOrAdmin")]

        private string GetUserIdFromClaims()
        {
            var userId = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                throw new UnauthorizedAccessException("User ID not found in token.");
            }
            return userId;
        }

        [Authorize(Policy = "UserOrAdmin")]

        [HttpPost("update-resume")]
        public async Task<IActionResult> UpdateResume([FromForm] IFormFile resumeFile)
        {
            var userId = GetUserIdFromClaims(); // בהנחה שאתה מקבל את userId מה-Claims של JWT
            try
            {
                await _service.UpdateResumeAsync(int.Parse(userId), resumeFile); // קריאה אסינכרונית
                return Ok(new { message = "Resume updated successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error updating resume.", details = ex.Message });
            }
        }
        [Authorize(Policy = "UserOrAdmin")]
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userId = GetUserIdFromClaims();

            var user = await _service.GetByIdAsync(int.Parse(userId));
            if (user == null)
                return NotFound();

            return Ok(user);
        }

    }
}
