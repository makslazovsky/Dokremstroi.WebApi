using Dokremstroi.Data.Models;
using Dokremstroi.Data.Repositories;
using Dokremstroi.Services.Managers;
using Moq;
using System.Linq.Expressions;

namespace Dokremstroi.Tests
{
    [TestFixture]
    public class UserOrderManagerTests
    {
        private Mock<IRepository<UserOrder>> _mockRepository;
        private UserOrderManager _userOrderManager;

        [SetUp]
        public void Setup()
        {
            _mockRepository = new Mock<IRepository<UserOrder>>();
            _userOrderManager = new UserOrderManager(_mockRepository.Object);
        }

        [Test]
        public async Task GetAllAsync_ShouldReturnAllOrders()
        {
            // Arrange
            var orders = new List<UserOrder>
        {
            new UserOrder { Id = 1, UserId = 101, TotalCost = 500, Status = "Completed" },
            new UserOrder { Id = 2, UserId = 102, TotalCost = 300, Status = "Pending" }
        };
            _mockRepository.Setup(repo => repo.GetAllAsync()).ReturnsAsync(orders);

            // Act
            var result = await _userOrderManager.GetAllAsync();

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(2, result.Count());
            Assert.IsTrue(result.Any(o => o.Id == 1));
            Assert.IsTrue(result.Any(o => o.Id == 2));
        }

        [Test]
        public async Task GetByIdAsync_ShouldReturnCorrectOrder()
        {
            // Arrange
            var order = new UserOrder { Id = 1, UserId = 101, TotalCost = 500, Status = "Completed" };
            _mockRepository.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(order);

            // Act
            var result = await _userOrderManager.GetByIdAsync(1);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Id);
            Assert.AreEqual(101, result.UserId);
        }

        [Test]
        public async Task AddAsync_ShouldCallRepositoryAdd()
        {
            // Arrange
            var newOrder = new UserOrder { Id = 3, UserId = 103, TotalCost = 700, Status = "Processing" };

            // Act
            await _userOrderManager.AddAsync(newOrder);

            // Assert
            _mockRepository.Verify(repo => repo.AddAsync(newOrder), Times.Once);
        }

        [Test]
        public async Task UpdateAsync_ShouldCallRepositoryUpdate()
        {
            // Arrange
            var order = new UserOrder { Id = 2, UserId = 102, TotalCost = 300, Status = "Pending" };

            // Act
            await _userOrderManager.UpdateAsync(order);

            // Assert
            _mockRepository.Verify(repo => repo.UpdateAsync(order), Times.Once);
        }

        [Test]
        public async Task DeleteAsync_ShouldCallRepositoryDelete()
        {
            // Arrange
            var orderId = 1;

            // Act
            await _userOrderManager.DeleteAsync(orderId);

            // Assert
            _mockRepository.Verify(repo => repo.DeleteAsync(orderId), Times.Once);
        }

        [Test]
        public async Task FindAsync_ShouldReturnMatchingOrder()
        {
            // Arrange
            var order = new UserOrder { Id = 1, UserId = 101, TotalCost = 500, Status = "Completed" };
            _mockRepository.Setup(repo => repo.FindAsync(It.IsAny<Expression<Func<UserOrder, bool>>>()))
                           .ReturnsAsync(order);

            // Act
            var result = await _userOrderManager.FindAsync(o => o.UserId == 101);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(101, result.UserId);
        }

        [Test]
        public async Task GetFilteredAsync_ShouldReturnFilteredOrders()
        {
            // Arrange
            var orders = new List<UserOrder>
        {
            new UserOrder { Id = 1, UserId = 101, TotalCost = 500, Status = "Completed" },
            new UserOrder { Id = 2, UserId = 102, TotalCost = 300, Status = "Pending" }
        };

            _mockRepository.Setup(repo => repo.GetFilteredAsync(It.IsAny<Expression<Func<UserOrder, bool>>>()))
                           .ReturnsAsync((Expression<Func<UserOrder, bool>> predicate) => orders.Where(predicate.Compile()));

            // Act
            var result = await _userOrderManager.GetFilteredAsync(o => o.Status == "Completed");

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count());
            Assert.AreEqual("Completed", result.First().Status);
        }
    }
}