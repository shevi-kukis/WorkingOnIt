using Microsoft.AspNetCore.Mvc;
using WorkingOnIt.Core.Dtos;
using WorkingOnIt.Core.InterfaceService;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WorkingOnIt.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InterviewController(IInterviewService service) : ControllerBase
    {
        private readonly IInterviewService _service = service;

        // GET: api/Interview
        [HttpGet]
        public async Task<ActionResult<List<InterviewDto>>> Get()
        {
            var result = await _service.GetAllAsync();
            return Ok(result);
        }

        // GET api/Interview/5
        [HttpGet("{id}")]
        public async Task<ActionResult<InterviewDto>> Get(int id)
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null)
                return NotFound();
            return Ok(result);
        }

        // POST api/Interview
        [HttpPost]
        public async Task<ActionResult<InterviewDto>> Post([FromBody] InterviewDto value)
        {
            if (value == null)
                return BadRequest("Invalid interview data.");

            var result = await _service.AddAsync(value);
            return CreatedAtAction(nameof(Get), new { id = result.Id }, result);
        }

        // PUT api/Interview/5
        [HttpPut("{id}")]
        public async Task<ActionResult<InterviewDto>> Put(int id, [FromBody] InterviewDto value)
        {
            if (value == null)
                return BadRequest("Invalid interview data.");

            var result = await _service.UpdateAsync(id, value);
            return Ok(result);
        }

        // DELETE api/Interview/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> Delete(int id)
        {
            var isDeleted = await _service.DeleteAsync(id);
            if (!isDeleted)
                return NotFound();
            return Ok(true);
        }
    }
}
